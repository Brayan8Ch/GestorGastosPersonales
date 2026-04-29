import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface Props {
  path: string | null
  onClose: () => void
  getUrl: (path: string) => Promise<string>
}

export function ReceiptModal({ path, onClose, getUrl }: Props) {
  const [url, setUrl] = useState<string | null>(null)
  const open = path !== null

  useEffect(() => {
    if (!path) { setUrl(null); return }
    getUrl(path).then(setUrl)
  }, [path, getUrl])

  const isPdf = path?.split('.').pop()?.toLowerCase() === 'pdf'

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Recibo</DialogTitle>
        </DialogHeader>
        <div className="flex items-center justify-center min-h-64">
          {!url ? (
            <p className="text-muted-foreground text-sm">Cargando...</p>
          ) : isPdf ? (
            <iframe src={url} className="w-full h-[70vh] rounded-md border border-border" title="Recibo" />
          ) : (
            <img src={url} alt="Recibo" className="max-w-full max-h-[70vh] rounded-md object-contain" />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
