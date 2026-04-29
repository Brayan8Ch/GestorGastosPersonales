import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Props {
  onSignIn: (email: string, password: string) => Promise<void>
  onSignUp: (email: string, password: string) => Promise<void>
}

export function AuthPage({ onSignIn, onSignUp }: Props) {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      if (mode === 'login') {
        await onSignIn(email, password)
      } else {
        await onSignUp(email, password)
        setSuccess('Cuenta creada. Revisá tu email para confirmar.')
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
              <circle cx="12" cy="12" r="1"/><path d="M4 12a8 8 0 0 0 16 0 8 8 0 0 0-16 0"/><path d="M12 6v6"/><path d="M12 18v.01"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">FinanceApp</h1>
          <p className="text-sm text-muted-foreground mt-1">Controlá tus ingresos y egresos</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex bg-muted rounded-lg p-1 mb-6 gap-1">
              {(['login', 'register'] as const).map(m => (
                <button
                  key={m}
                  onClick={() => { setMode(m); setError(''); setSuccess('') }}
                  className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    mode === m ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
                  }`}
                >
                  {m === 'login' ? 'Iniciar sesión' : 'Registrarse'}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="tu@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">Contraseña</Label>
                <Input id="password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>

              {error && (
                <p className="text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-md px-3 py-2">{error}</p>
              )}
              {success && (
                <p className="text-xs text-primary bg-primary/10 border border-primary/20 rounded-md px-3 py-2">{success}</p>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? '...' : mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
