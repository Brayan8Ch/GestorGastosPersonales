import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { SavingsPlatform, PlatformType } from '@/types'
import { PlatformModal } from '@/components/savings/PlatformModal'
import type { PlatformPayload } from '@/hooks/useSavings'

const PLATFORM_LABELS: Record<PlatformType, string> = {
  bank: 'Banco',
  fintech: 'Fintech',
  crypto: 'Cripto',
  cash: 'Efectivo',
  investment: 'Inversión',
}

function formatARS(n: number) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n)
}

interface Props {
  platforms: SavingsPlatform[]
  total: number
  userId: string
  onSave: (payload: PlatformPayload, id?: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

export function SavingsCard({ platforms, total, userId, onSave, onDelete }: Props) {
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<SavingsPlatform | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  const openAdd = () => { setEditing(null); setModalOpen(true) }
  const openEdit = (p: SavingsPlatform) => { setEditing(p); setModalOpen(true) }

  const handleDeleteClick = (id: string) => {
    if (confirmDeleteId === id) {
      onDelete(id)
      setConfirmDeleteId(null)
    } else {
      setConfirmDeleteId(id)
      setTimeout(() => setConfirmDeleteId(prev => prev === id ? null : prev), 3000)
    }
  }

  return (
    <>
      <Card className="md:col-span-2">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Base de ahorro
            </CardTitle>
            <Button size="sm" variant="ghost" onClick={openAdd} className="h-7 text-xs gap-1 text-primary hover:text-primary hover:bg-primary/10">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Agregar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-3xl font-bold text-primary">{formatARS(total)}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Total guardado</p>
          </div>

          {platforms.length === 0 ? (
            <p className="text-sm text-muted-foreground py-2">Agregá tu primera plataforma de ahorro.</p>
          ) : (
            <div className="space-y-2">
              {platforms.map(p => (
                <div key={p.id} className="flex items-center gap-3 group">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: p.color }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-medium truncate">{p.name}</span>
                      <span className="text-xs text-muted-foreground">· {PLATFORM_LABELS[p.type]}</span>
                    </div>
                    {total > 0 && (
                      <div className="mt-1 h-1 rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${(p.balance / total) * 100}%`, background: p.color }} />
                      </div>
                    )}
                  </div>
                  <span className="text-sm font-semibold flex-shrink-0">{formatARS(p.balance)}</span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
                    <button onClick={() => openEdit(p)} aria-label="Editar plataforma" className="p-1 rounded text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteClick(p.id)}
                      aria-label={confirmDeleteId === p.id ? 'Confirmar eliminación' : 'Eliminar plataforma'}
                      className={`p-1 rounded transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-destructive ${confirmDeleteId === p.id ? 'text-destructive' : 'text-muted-foreground hover:text-destructive'}`}
                    >
                      {confirmDeleteId === p.id ? (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      ) : (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                          <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <PlatformModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={onSave}
        userId={userId}
        editing={editing}
      />
    </>
  )
}
