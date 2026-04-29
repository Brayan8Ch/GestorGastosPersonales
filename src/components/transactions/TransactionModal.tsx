import { useEffect, useRef, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Card, Transaction, TransactionPayload, TransactionType } from '@/types'

const CATEGORIES: Record<TransactionType, string[]> = {
  income: ['Salario', 'Freelance', 'Inversiones', 'Alquiler', 'Otro'],
  expense: ['Vivienda', 'Alimentación', 'Transporte', 'Salud', 'Educación', 'Entretenimiento', 'Ropa', 'Servicios', 'Otro'],
}

interface Props {
  open: boolean
  onClose: () => void
  onSave: (payload: TransactionPayload, file?: File, id?: string) => Promise<void>
  userId: string
  editing?: Transaction | null
  cards: Card[]
}

function localToday() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function TransactionModal({ open, onClose, onSave, userId, editing, cards }: Props) {
  const [type, setType] = useState<TransactionType>('expense')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [date, setDate] = useState(localToday)
  const [description, setDescription] = useState('')
  const [cardId, setCardId] = useState<string>('none')
  const [file, setFile] = useState<File | undefined>()
  const [saving, setSaving] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing) {
      setType(editing.type)
      setAmount(String(editing.amount))
      setCategory(editing.category)
      setDate(editing.date)
      setDescription(editing.description ?? '')
      setCardId(editing.card_id ?? 'none')
    } else {
      setType('expense')
      setAmount('')
      setCategory('')
      setDate(localToday())
      setDescription('')
      setCardId('none')
      setFile(undefined)
    }
  }, [editing, open])

  const categories = CATEGORIES[type]
  const resolvedCategory = categories.includes(category) ? category : categories[0]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await onSave(
        {
          user_id: userId,
          type,
          amount: parseFloat(amount),
          category: resolvedCategory,
          description,
          date,
          card_id: type === 'expense' && cardId !== 'none' ? cardId : null,
        },
        file,
        editing?.id,
      )
      onClose()
    } finally {
      setSaving(false)
    }
  }

  const expenseCards = cards.filter(c => c.type === 'credit' || c.type === 'debit')

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{editing ? 'Editar transacción' : 'Nueva transacción'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 pt-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select value={type} onValueChange={v => { setType(v as TransactionType); setCategory('') }}>
                <SelectTrigger>
                  <SelectValue>{type === 'income' ? 'Ingreso' : 'Egreso'}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Ingreso</SelectItem>
                  <SelectItem value="expense">Egreso</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Monto</Label>
              <Input type="number" min="0" step="0.01" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Categoría</Label>
              <Select value={resolvedCategory} onValueChange={setCategory}>
                <SelectTrigger><SelectValue>{resolvedCategory}</SelectValue></SelectTrigger>
                <SelectContent>
                  {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Fecha</Label>
              <Input type="date" value={date} onChange={e => setDate(e.target.value)} required />
            </div>
          </div>

          {type === 'expense' && expenseCards.length > 0 && (
            <div className="space-y-2">
              <Label>Tarjeta <span className="text-muted-foreground">(opcional)</span></Label>
              <Select value={cardId} onValueChange={setCardId}>
                <SelectTrigger><SelectValue placeholder="Sin tarjeta" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sin tarjeta</SelectItem>
                  {expenseCards.map(c => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name} {c.last4 ? `·· ${c.last4}` : ''} — {c.bank}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label>Descripción <span className="text-muted-foreground">(opcional)</span></Label>
            <Textarea placeholder="Ej: Sueldo de abril..." value={description} onChange={e => setDescription(e.target.value)} className="resize-none h-24" />
          </div>
          <div className="space-y-2">
            <Label>Recibo <span className="text-muted-foreground">(imagen o PDF, opcional)</span></Label>
            <Input ref={fileRef} type="file" accept="image/*,.pdf" onChange={e => setFile(e.target.files?.[0])} />
          </div>
          <div className="flex gap-3 pt-1">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Cancelar</Button>
            <Button type="submit" className="flex-[2]" disabled={saving}>{saving ? 'Guardando...' : 'Guardar'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
