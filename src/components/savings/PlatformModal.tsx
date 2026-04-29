import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { SavingsPlatform, PlatformType } from '@/types'
import type { PlatformPayload } from '@/hooks/useSavings'

const TYPES: { value: PlatformType; label: string }[] = [
  { value: 'bank', label: 'Banco' },
  { value: 'fintech', label: 'Fintech' },
  { value: 'investment', label: 'Inversión' },
  { value: 'crypto', label: 'Cripto' },
  { value: 'cash', label: 'Efectivo' },
]

const PRESET_COLORS = ['#3ecf8e','#6366f1','#f59e0b','#ec4899','#06b6d4','#8b5cf6','#ef4444','#14b8a6']

interface Props {
  open: boolean
  onClose: () => void
  onSave: (payload: PlatformPayload, id?: string) => Promise<void>
  userId: string
  editing?: SavingsPlatform | null
}

export function PlatformModal({ open, onClose, onSave, userId, editing }: Props) {
  const [name, setName] = useState('')
  const [type, setType] = useState<PlatformType>('bank')
  const [balance, setBalance] = useState('')
  const [color, setColor] = useState(PRESET_COLORS[0])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (editing) {
      setName(editing.name)
      setType(editing.type)
      setBalance(String(editing.balance))
      setColor(editing.color)
    } else {
      setName('')
      setType('bank')
      setBalance('')
      setColor(PRESET_COLORS[0])
    }
  }, [editing, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await onSave({ user_id: userId, name, type, balance: parseFloat(balance) || 0, color }, editing?.id)
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{editing ? 'Editar plataforma' : 'Nueva plataforma de ahorro'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label>Nombre</Label>
            <Input placeholder="Ej: Brubank, Mercado Pago..." value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Tipo</Label>
              <Select value={type} onValueChange={v => setType(v as PlatformType)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Saldo actual</Label>
              <Input type="number" min="0" step="0.01" placeholder="0.00" value={balance} onChange={e => setBalance(e.target.value)} />
            </div>
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
