import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Card, CardType } from '@/types'
import type { CardPayload } from '@/hooks/useCards'

const PRESET_COLORS = ['#3ecf8e','#6366f1','#f59e0b','#ec4899','#06b6d4','#8b5cf6','#ef4444','#14b8a6']

interface Props {
  open: boolean
  onClose: () => void
  onSave: (payload: CardPayload, id?: string) => Promise<void>
  userId: string
  editing?: Card | null
}

export function CardModal({ open, onClose, onSave, userId, editing }: Props) {
  const [name, setName] = useState('')
  const [bank, setBank] = useState('')
  const [last4, setLast4] = useState('')
  const [type, setType] = useState<CardType>('credit')
  const [color, setColor] = useState(PRESET_COLORS[0])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (editing) {
      setName(editing.name)
      setBank(editing.bank)
      setLast4(editing.last4 ?? '')
      setType(editing.type)
      setColor(editing.color)
    } else {
      setName('')
      setBank('')
      setLast4('')
      setType('credit')
      setColor(PRESET_COLORS[0])
    }
  }, [editing, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await onSave({ user_id: userId, name, bank, last4, type, color }, editing?.id)
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{editing ? 'Editar tarjeta' : 'Nueva tarjeta'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label>Nombre de la tarjeta</Label>
            <Input placeholder="Ej: Visa Gold, Naranja X..." value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Banco / Emisor</Label>
              <Input placeholder="Ej: Galicia, BBVA..." value={bank} onChange={e => setBank(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label>Últimos 4 dígitos</Label>
              <Input
                placeholder="1234"
                maxLength={4}
                value={last4}
                onChange={e => setLast4(e.target.value.replace(/\D/g, '').slice(0, 4))}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Tipo</Label>
            <Select value={type} onValueChange={v => setType(v as CardType)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="credit">Crédito</SelectItem>
                <SelectItem value="debit">Débito</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Color</Label>
            <div className="flex gap-2 flex-wrap">
              {PRESET_COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className="w-7 h-7 rounded-full transition-transform hover:scale-110"
                  style={{ background: c, outline: color === c ? `2px solid ${c}` : 'none', outlineOffset: 2 }}
                />
              ))}
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Cancelar</Button>
            <Button type="submit" className="flex-[2]" disabled={saving}>{saving ? 'Guardando...' : 'Guardar'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
