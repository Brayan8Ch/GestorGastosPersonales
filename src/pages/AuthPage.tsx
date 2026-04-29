import { useState } from 'react'

interface Props {
  onSignIn: (email: string, password: string) => Promise<void>
}

export function AuthPage({ onSignIn }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await onSignIn(email, password)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#111111' }}>
      <div className="w-full max-w-sm">

        {/* Card */}
        <div className="rounded-2xl px-8 py-10" style={{ background: '#1c1c1c', border: '1px solid #2a2a2a' }}>

          {/* Ícono */}
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: '#3ecf8e' }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="2">
                <rect x="2" y="5" width="20" height="14" rx="2"/>
                <path d="M2 10h20"/>
                <circle cx="7" cy="15" r="1" fill="#0a0a0a" stroke="none"/>
              </svg>
            </div>
          </div>

          {/* Título */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white">Bienvenido de vuelta</h1>
            <p className="text-sm mt-1.5" style={{ color: '#6b6b6b' }}>
              Controlá tu futuro financiero con precisión.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-widest" style={{ color: '#6b6b6b' }}>
                Correo electrónico
              </label>
              <div className="flex items-center rounded-lg px-3.5 gap-3" style={{ background: '#111111', border: '1px solid #2a2a2a' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#4b4b4b" strokeWidth="2" className="flex-shrink-0">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
                <input
                  type="email"
                  placeholder="nombre@empresa.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="flex-1 py-3.5 text-sm bg-transparent outline-none text-white"
                  style={{ caretColor: '#3ecf8e' }}
                />
              </div>
            </div>

            {/* Contraseña */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-widest" style={{ color: '#6b6b6b' }}>
                Contraseña
              </label>
              <div className="flex items-center rounded-lg px-3.5 gap-3" style={{ background: '#111111', border: '1px solid #2a2a2a' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#4b4b4b" strokeWidth="2" className="flex-shrink-0">
                  <rect x="3" y="11" width="18" height="11" rx="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="flex-1 py-3.5 text-sm bg-transparent outline-none text-white"
                  style={{ caretColor: '#3ecf8e' }}
                />
              </div>
            </div>

            {error && (
              <p className="text-xs rounded-lg px-3 py-2.5" style={{ color: '#f87171', background: '#1f1212', border: '1px solid #3a1c1c' }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-lg py-3.5 text-sm font-semibold transition-opacity disabled:opacity-50 mt-1"
              style={{ background: '#3ecf8e', color: '#0a0a0a' }}
            >
              {loading ? 'Iniciando sesión...' : (
                <>
                  Iniciar sesión
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </>
              )}
            </button>

          </form>
        </div>
      </div>
    </div>
  )
}
