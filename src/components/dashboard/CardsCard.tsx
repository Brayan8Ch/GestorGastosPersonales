import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { Card as CardType } from '@/types'
import { CardModal } from '@/components/cards/CardModal'
import type { CardPayload } from '@/hooks/useCards'

interface Props {
  cards: CardType[]
  userId: string
  onSave: (payload: CardPayload, id?: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

export function CardsCard({ cards, userId, onSave, onDelete }: Props) {
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<CardType | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  const openAdd = () => { setEditing(null); setModalOpen(true) }
  const openEdit = (c: CardType) => { setEditing(c); setModalOpen(true) }

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
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Mis tarjetas
            </CardTitle>
            <Button size="sm" variant="ghost" onClick={openAdd} className="h-7 text-xs gap-1 text-primary hover:text-primary hover:bg-primary/10">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Agregar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {cards.length === 0 ? (
            <p className="text-sm text-muted-foreground py-2">Agregá tu primera tarjeta.</p>
          ) : cards.map(c => (
            <div key={c.id} className="group flex items-center gap-3 p-2.5 rounded-lg border border-border/50 hover:border-border transition-colors">
              <div className="w-9 h-6 rounded flex items-center justify-center flex-shrink-0" style={{ background: c.color + '22', border: `1px solid ${c.color}44` }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c.color} strokeWidth="2" aria-hidden="true">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                  <line x1="1" y1="10" x2="23" y2="10"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{c.name}</p>
                <p className="text-xs text-muted-foreground">{c.bank} {c.last4 ? `·· ${c.last4}` : ''} · {c.type === 'credit' ? 'Crédito' : 'Débito'}</p>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
                <button onClick={() => openEdit(c)} aria-label="Editar tarjeta" className="p-1 rounded text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </button>
                <button
                  onClick={() => handleDeleteClick(c.id)}
                  aria-label={confirmDeleteId === c.id ? 'Confirmar eliminación' : 'Eliminar tarjeta'}
                  className={`p-1 rounded transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-destructive ${confirmDeleteId === c.id ? 'text-destructive' : 'text-muted-foreground hover:text-destructive'}`}
                >
                  {confirmDeleteId === c.id ? (
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
        </CardContent>
      </Card>

      <CardModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={onSave}
        userId={userId}
        editing={editing}
      />
    </>
  )
}
