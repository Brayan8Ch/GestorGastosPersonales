import { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'

interface Props {
  onConfirm: () => void
  children: React.ReactNode
}

export function DeleteConfirmPopover({ onConfirm, children }: Props) {
  const [open, setOpen] = useState(false)

  const handleConfirm = () => {
    setOpen(false)
    onConfirm()
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors" title="Eliminar">
        {children}
      </PopoverTrigger>
      <PopoverContent
        side="left"
        align="center"
        className="w-56 p-3 space-y-3"
        onClick={e => e.stopPropagation()}
      >
        <div className="space-y-0.5">
          <p className="text-sm font-medium">¿Eliminar transacción?</p>
          <p className="text-xs text-muted-foreground">Esta acción no se puede deshacer.</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 h-7 text-xs"
            onClick={() => setOpen(false)}
          >
            Cancelar
          </Button>
          <Button
            size="sm"
            className="flex-1 h-7 text-xs bg-destructive hover:bg-destructive/90 text-white border-0"
            onClick={handleConfirm}
          >
            Eliminar
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
