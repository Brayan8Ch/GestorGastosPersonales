import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) return json({ error: 'No autorizado' }, 401)

    const token = authHeader.replace('Bearer ', '')
    const { data: { user: caller }, error: authError } = await supabaseAdmin.auth.getUser(token)
    if (authError || !caller) return json({ error: 'Token inválido' }, 401)

    const { data: callerProfile } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', caller.id)
      .single()

    if (callerProfile?.role !== 'superadmin') return json({ error: 'Acceso denegado' }, 403)

    const body = await req.json()
    const { action, userId, newPassword, banned } = body

    switch (action) {
      case 'list': {
        const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 })
        if (error) return json({ error: error.message }, 400)

        const { data: profiles } = await supabaseAdmin.from('profiles').select('id, role')
        const roleMap = new Map(profiles?.map((p: { id: string; role: string }) => [p.id, p.role]) ?? [])

        return json({
          caller_id: caller.id,
          users: users.map(u => ({
            id: u.id,
            email: u.email,
            created_at: u.created_at,
            is_banned: u.banned_until ? new Date(u.banned_until) > new Date() : false,
            role: roleMap.get(u.id) ?? 'user',
          })),
        })
      }

      case 'update-password': {
        if (!userId || !newPassword) return json({ error: 'Datos incompletos' }, 400)
        if (newPassword.length < 6) return json({ error: 'Mínimo 6 caracteres' }, 400)
        const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, { password: newPassword })
        if (error) return json({ error: error.message }, 400)
        return json({ success: true })
      }

      case 'delete': {
        if (!userId) return json({ error: 'userId requerido' }, 400)
        if (userId === caller.id) return json({ error: 'No podés eliminarte a vos mismo' }, 400)
        const { error } = await supabaseAdmin.auth.admin.deleteUser(userId)
        if (error) return json({ error: error.message }, 400)
        return json({ success: true })
      }

      case 'set-status': {
        if (!userId) return json({ error: 'userId requerido' }, 400)
        if (userId === caller.id) return json({ error: 'No podés deshabilitarte a vos mismo' }, 400)
        const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
          ban_duration: banned ? '87600h' : 'none',
        })
        if (error) return json({ error: error.message }, 400)
        return json({ success: true })
      }

      default:
        return json({ error: 'Acción inválida' }, 400)
    }
  } catch {
    return json({ error: 'Error interno del servidor' }, 500)
  }
})
