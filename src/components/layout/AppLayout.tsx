import { useState } from 'react'
import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'

type View = 'dashboard' | 'transactions' | 'admin'

interface Props {
  email: string
  view: View
  isSuperAdmin: boolean
  onViewChange: (v: View) => void
  onSignOut: () => void
  children: ReactNode
  monthLabel: string
  onPrevMonth: () => void
  onNextMonth: () => void
}

const NAV_ITEMS: { key: View; label: string }[] = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'transactions', label: 'Transacciones' },
]

export function AppLayout({
  email,
  view,
  isSuperAdmin,
  onViewChange,
  onSignOut,
  children,
  monthLabel,
  onPrevMonth,
  onNextMonth,
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false)

  const navItems = isSuperAdmin
    ? [...NAV_ITEMS, { key: 'admin' as View, label: 'Administración' }]
    : NAV_ITEMS

  function handleNav(key: View) {
    onViewChange(key)
    setMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-x-hidden">
      <header className="sticky top-0 z-20 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="font-bold text-primary text-lg tracking-tight">FinanceApp</span>
            {/* Desktop nav */}
            <nav className="hidden sm:flex gap-1">
              {navItems.map(({ key, label }) => (
                
                <button
                  key={key}
                  onClick={() => handleNav(key)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    view === key
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {label}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground hidden sm:block">{email}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={onSignOut}
              className="text-xs hidden sm:inline-flex"
            >
              Cerrar sesión
            </Button>
            {/* Hamburger — mobile only */}
            <button
              className="sm:hidden flex items-center justify-center w-8 h-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
              onClick={() => setMenuOpen(prev => !prev)}
              aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
              <span className={`transition-transform duration-200 ${menuOpen ? 'rotate-90' : 'rotate-0'}`}>
                {menuOpen ? <X size={18} /> : <Menu size={18} />}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        <div
          className={`sm:hidden border-border bg-card overflow-hidden transition-all duration-300 ease-in-out ${
            menuOpen ? 'max-h-64 opacity-100 border-t' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-1">
            {navItems.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => handleNav(key)}
                className={`w-full text-left px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  view === key
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                }`}
              >
                {label}
              </button>
            ))}
            <div className="mt-2 pt-2 border-t border-border flex items-center justify-between gap-3">
              <span className="text-xs text-muted-foreground truncate">{email}</span>
              <Button variant="outline" size="sm" onClick={onSignOut} className="text-xs shrink-0">
                Cerrar sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 w-full">
        {view !== 'admin' && (
          <div className="flex items-center gap-3 mb-6 justify-center md:justify-start">
            <button
              onClick={onPrevMonth}
              className="w-8 h-8 flex items-center justify-center rounded-md border border-border hover:border-primary/50 transition-colors text-muted-foreground hover:text-foreground"
            >
              ‹
            </button>
            <span className="font-semibold min-w-36 text-center">{monthLabel}</span>
            <button
              onClick={onNextMonth}
              className="w-8 h-8 flex items-center justify-center rounded-md border border-border hover:border-primary/50 transition-colors text-muted-foreground hover:text-foreground"
            >
              ›
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  )
}
