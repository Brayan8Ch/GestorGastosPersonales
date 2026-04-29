import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { DeleteConfirmPopover } from '@/components/ui/delete-confirm-popover'

interface UserRecord {
  id: string
  email: string
  created_at: string
  is_banned: boolean
  role: string
}

interface Props {
  userId: string
}

function formatDate(s: string) {
  const d = new Date(s)
  return d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function initials(email: string) {
  return email.slice(0, 2).toUpperCase()
}

async function callManageUser(body: Record<string, unknown>) {
  const { data: { session } } = await supabase.auth.getSession()
  const { data, error } = await supabase.functions.invoke('manage-user', {
    body,
    headers: session ? { Authorization: `Bearer ${session.access_token}` } : undefined,
  })
  if (error) throw error
  if (data?.error) throw new Error(data.error)
  return data
}

export function SuperAdminPage({ userId }: Props) {
  // Create user form
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [creating, setCreating] = useState(false)
  const [createResult, setCreateResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  // User list
  const [users, setUsers] = useState<UserRecord[]>([])
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [usersError, setUsersError] = useState('')

  // Password change per user
  const [pwdEditId, setPwdEditId] = useState<string | null>(null)
  const [pwdValue, setPwdValue] = useState('')
  const [pwdLoading, setPwdLoading] = useState(false)
  const [pwdError, setPwdError] = useState('')

  // Action loading per user (ban toggle)
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null)

  async function loadUsers() {
    setLoadingUsers(true)
    setUsersError('')
    try {
      const data = await callManageUser({ action: 'list' })
      setUsers(data.users ?? [])
    } catch (err) {
      setUsersError(err instanceof Error ? err.message : 'Error al cargar usuarios')
    } finally {
      setLoadingUsers(false)
    }
  }

  useEffect(() => { loadUsers() }, [])

  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault()
    setCreating(true)
    setCreateResult(null)
    try {
      await supabase.functions.invoke('create-user', { body: { email, password } })
      setCreateResult({ type: 'success', message: `Usuario ${email} creado correctamente.` })
      setEmail('')
      setPassword('')
      loadUsers()
    } catch (err) {
      setCreateResult({ type: 'error', message: err instanceof Error ? err.message : 'Error desconocido' })
    } finally {
      setCreating(false)
    }
  }

  async function handleToggleBan(user: UserRecord) {
    setActionLoadingId(user.id)
    try {
      await callManageUser({ action: 'set-status', userId: user.id, banned: !user.is_banned })
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, is_banned: !u.is_banned } : u))
    } catch {
      // silently fail — reload to get real state
      loadUsers()
    } finally {
      setActionLoadingId(null)
    }
  }

  async function handleDelete(userId: string) {
    try {
      await callManageUser({ action: 'delete', userId })
      setUsers(prev => prev.filter(u => u.id !== userId))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al eliminar')
    }
  }

  async function handleUpdatePassword(userId: string) {
    if (!pwdValue) return
    setPwdLoading(true)
    setPwdError('')
    try {
      await callManageUser({ action: 'update-password', userId, newPassword: pwdValue })
      setPwdEditId(null)
      setPwdValue('')
    } catch (err) {
      setPwdError(err instanceof Error ? err.message : 'Error al actualizar contraseña')
    } finally {
      setPwdLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-8">
      <h1 className="text-xl font-bold">Panel de Administración</h1>

      {/* Crear usuario */}
      <Card className="p-6">
        <h2 className="font-semibold mb-4 text-sm text-muted-foreground uppercase tracking-wide">
          Crear nuevo usuario
        </h2>
        <form onSubmit={handleCreateUser} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="new-email">Correo electrónico</Label>
              <Input id="new-email" type="email" placeholder="usuario@ejemplo.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="new-password">Contraseña temporal</Label>
              <Input id="new-password" type="password" placeholder="Mínimo 6 caracteres" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
            </div>
          </div>
          {createResult && (
            <p className={`text-sm ${createResult.type === 'success' ? 'text-primary' : 'text-destructive'}`}>
              {createResult.message}
            </p>
          )}
          <Button type="submit" disabled={creating} className="w-fit">
            {creating ? 'Creando...' : 'Crear usuario'}
          </Button>
        </form>
      </Card>

      {/* Lista de usuarios */}
      <Card className="overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
            Usuarios registrados
            {!loadingUsers && <span className="ml-2 text-foreground">({users.length})</span>}
          </h2>
          <button
            onClick={loadUsers}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            title="Actualizar"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
              <path d="M21 3v5h-5"/>
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
              <path d="M8 16H3v5"/>
            </svg>
          </button>
        </div>

        {loadingUsers ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </div>
        ) : usersError ? (
          <p className="text-sm text-destructive text-center py-8">{usersError}</p>
        ) : users.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No hay usuarios.</p>
        ) : (
          <div className="divide-y divide-border">
            {users.map(u => (
              <div key={u.id}>
                {/* Fila principal */}
                <div className="flex items-center gap-3 px-6 py-3.5">
                  {/* Avatar */}
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${u.is_banned ? 'bg-muted text-muted-foreground' : 'bg-primary/10 text-primary'}`}>
                    {initials(u.email ?? '?')}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium truncate">{u.email}</p>
                      {u.role === 'superadmin' && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-primary/10 text-primary">ADMIN</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${u.is_banned ? 'bg-destructive/10 text-destructive' : 'bg-green-500/10 text-green-500'}`}>
                        {u.is_banned ? 'Deshabilitado' : 'Activo'}
                      </span>
                      <span className="text-xs text-muted-foreground">desde {formatDate(u.created_at)}</span>
                    </div>
                  </div>

                  {/* Acciones */}
                  {u.id !== userId && (
                    <div className="flex items-center gap-0.5 flex-shrink-0">
                      {/* Cambiar contraseña */}
                      <button
                        onClick={() => { setPwdEditId(pwdEditId === u.id ? null : u.id); setPwdValue(''); setPwdError('') }}
                        className={`p-1.5 rounded-md transition-colors ${pwdEditId === u.id ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}
                        title="Cambiar contraseña"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="11" width="18" height="11" rx="2"/>
                          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                        </svg>
                      </button>

                      {/* Habilitar / Deshabilitar */}
                      <button
                        onClick={() => handleToggleBan(u)}
                        disabled={actionLoadingId === u.id}
                        className={`p-1.5 rounded-md transition-colors disabled:opacity-40 ${u.is_banned ? 'text-green-500 hover:bg-green-500/10' : 'text-muted-foreground hover:text-destructive hover:bg-destructive/10'}`}
                        title={u.is_banned ? 'Habilitar usuario' : 'Deshabilitar usuario'}
                      >
                        {actionLoadingId === u.id ? (
                          <div className="w-3.5 h-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" />
                        ) : u.is_banned ? (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                            <polyline points="22 4 12 14.01 9 11.01"/>
                          </svg>
                        ) : (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
                          </svg>
                        )}
                      </button>

                      {/* Eliminar */}
                      <DeleteConfirmPopover onConfirm={() => handleDelete(u.id)}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                      </DeleteConfirmPopover>
                    </div>
                  )}
                </div>

                {/* Panel de cambio de contraseña */}
                {pwdEditId === u.id && (
                  <div className="px-6 pb-4 flex items-start gap-2">
                    <div className="flex-1">
                      <Input
                        type="password"
                        placeholder="Nueva contraseña (mín. 6 caracteres)"
                        value={pwdValue}
                        onChange={e => setPwdValue(e.target.value)}
                        minLength={6}
                        className="h-8 text-xs"
                      />
                      {pwdError && <p className="text-xs text-destructive mt-1">{pwdError}</p>}
                    </div>
                    <Button size="sm" className="h-8 text-xs" disabled={pwdLoading || pwdValue.length < 6} onClick={() => handleUpdatePassword(u.id)}>
                      {pwdLoading ? '...' : 'Guardar'}
                    </Button>
                    <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => { setPwdEditId(null); setPwdValue('') }}>
                      Cancelar
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
