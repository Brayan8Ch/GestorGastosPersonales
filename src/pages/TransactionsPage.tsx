import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DeleteConfirmPopover } from '@/components/ui/delete-confirm-popover'
import type { Transaction } from '@/types'

function formatARS(n: number) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n)
}

function formatDate(s: string) {
  const [y, m, d] = s.split('-')
  return `${d}/${m}/${y}`
}

interface Props {
  transactions: Transaction[]
  onAdd: () => void
  onEdit: (t: Transaction) => void
  onDelete: (id: string) => void
  onViewReceipt: (path: string) => void
}

export function TransactionsPage({ transactions, onAdd, onEdit, onDelete, onViewReceipt }: Props) {
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all')

  const filtered = filter === 'all' ? transactions : transactions.filter(t => t.type === filter)

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Transacciones</CardTitle>
          <Button size="sm" onClick={onAdd} className="h-8 text-xs gap-1.5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Agregar
          </Button>
        </div>
        <div className="flex gap-1 mt-2">
          {(['all', 'income', 'expense'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                filter === f ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {f === 'all' ? 'Todos' : f === 'income' ? 'Ingresos' : 'Egresos'}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-12">No hay transacciones.</p>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map(t => (
              <div key={t.id} className="flex items-center gap-3 px-6 py-3 hover:bg-muted/30 transition-colors">
                <div className={`w-1.5 h-10 rounded-full flex-shrink-0 ${t.type === 'income' ? 'bg-primary' : 'bg-destructive'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{t.category}</p>
                  <p className="text-xs text-muted-foreground truncate">{t.description || '—'} · {formatDate(t.date)}</p>
                </div>
                <span className={`num text-sm font-semibold flex-shrink-0 ${t.type === 'income' ? 'text-primary' : 'text-destructive'}`}>
                  {t.type === 'income' ? '+' : '−'}{formatARS(t.amount)}
                </span>
                <div className="flex items-center gap-0.5 flex-shrink-0">
                  {t.receipt_url && (
                    <button
                      onClick={() => onViewReceipt(t.receipt_url!)}
                      className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
                      title="Ver recibo"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                      </svg>
                    </button>
                  )}
                  <button
                    onClick={() => onEdit(t)}
                    className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    title="Editar"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                  <DeleteConfirmPopover onConfirm={() => onDelete(t.id)}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                  </DeleteConfirmPopover>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
