import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'

export function SuperAdminPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)

    try {
      const { data, error } = await supabase.functions.invoke('create-user', {
        body: { email, password },
      })

      if (error) throw error
      if (data?.error) throw new Error(data.error)

      setResult({ type: 'success', message: `Usuario ${email} creado correctamente.` })
      setEmail('')
      setPassword('')
    } catch (err) {
      setResult({ type: 'error', message: err instanceof Error ? err.message : 'Error desconocido' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-xl font-bold mb-6">Panel de Administración</h1>

      <Card className="p-6">
        <h2 className="font-semibold mb-4 text-sm text-muted-foreground uppercase tracking-wide">
          Crear nuevo usuario
        </h2>

        <form onSubmit={handleCreateUser} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              placeholder="usuario@ejemplo.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">Contraseña temporal</Label>
            <Input
              id="password"
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          {result && (
            <p className={`text-sm ${result.type === 'success' ? 'text-green-600' : 'text-destructive'}`}>
              {result.message}
            </p>
          )}

          <Button type="submit" disabled={loading}>
            {loading ? 'Creando...' : 'Crear usuario'}
          </Button>
        </form>
      </Card>
    </div>
  )
}
