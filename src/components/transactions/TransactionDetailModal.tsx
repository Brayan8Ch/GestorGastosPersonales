import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { getCategoryIcon } from '@/lib/categories'
import type { Transaction } from '@/types'

function formatARS(n: number) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n)
}

function formatDate(s: string) {
  const [y, m, d] = s.split('-')
  return `${d}/${m}/${y}`
}

interface Props {
  transaction: Transaction | null
  open: boolean
  onClose: () => void
  onViewReceipt?: (path: string) => void
}

export function TransactionDetailModal({ transaction: t, open, onClose, onViewReceipt }: Props) {
  if (!t) return null

  const Icon = getCategoryIcon(t.category)
  const isIncome = t.type === 'income'

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="sr-only">Detalle de transacción</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-3 py-2">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${isIncome ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'}`}>
            <Icon size={28} />
          </div>
          <div className="text-center">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mb-1.5 ${isIncome ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'}`}>
              {isIncome ? 'Ingreso' : 'Egreso'}
            </span>
            <p className="text-lg font-semibold">{t.category}</p>
          </div>
          <p className={`text-4xl font-bold num ${isIncome ? 'text-primary' : 'text-destructive'}`}>
            {isIncome ? '+' : '−'}{formatARS(t.amount)}
          </p>
        </div>

        <div className="space-y-3 border-t border-border pt-4 mt-1">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Fecha</span>
            <span className="font-medium">{formatDate(t.date)}</span>
          </div>
          {t.description && (
            <div className="flex justify-between text-sm gap-4">
              <span className="text-muted-foreground flex-shrink-0">Descripción</span>
              <span className="font-medium text-right">{t.description}</span>
            </div>
          )}
          {t.receipt_url && onViewReceipt && (
            <button
              onClick={() => { onViewReceipt(t.receipt_url!); onClose() }}
              className="w-full mt-1 flex items-center justify-center gap-2 py-2 rounded-md border border-border text-sm text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
              Ver comprobante
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
