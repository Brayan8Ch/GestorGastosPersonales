import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'

interface Props {
  email: string
  view: 'dashboard' | 'transactions'
  onViewChange: (v: 'dashboard' | 'transactions') => void
  onSignOut: () => void
  children: ReactNode
  monthLabel: string
  onPrevMonth: () => void
  onNextMonth: () => void
}

export function AppLayout({ email, view, onViewChange, onSignOut, children, monthLabel, onPrevMonth, onNextMonth }: Props) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-20 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="font-bold text-primary text-lg tracking-tight">FinanceApp</span>
            <nav className="flex gap-1">
              {(['dashboard', 'transactions'] as const).map(v => (
                <button
                  key={v}
                  onClick={() => onViewChange(v)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors capitalize ${
                    view === v
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {v === 'dashboard' ? 'Dashboard' : 'Transacciones'}
                </button>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground hidden sm:block">{email}</span>
            <Button variant="outline" size="sm" onClick={onSignOut} className="text-xs">
              Cerrar sesión
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-4 w-full">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={onPrevMonth} className="w-8 h-8 flex items-center justify-center rounded-md border border-border hover:border-primary/50 transition-colors text-muted-foreground hover:text-foreground">‹</button>
          <span className="font-semibold min-w-36 text-center">{monthLabel}</span>
          <button onClick={onNextMonth} className="w-8 h-8 flex items-center justify-center rounded-md border border-border hover:border-primary/50 transition-colors text-muted-foreground hover:text-foreground">›</button>
        </div>
        {children}
      </div>
    </div>
  )
}
