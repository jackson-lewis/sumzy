import { AlertCircle, Info } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function Message({
  message,
  type = 'info'
}: {
  message: unknown
  type: 'info' | 'error'
}) {
  if (typeof message !== 'string' || !message) {
    return null
  }

  return (
    <Alert
      variant={type === 'info' ? 'default' : 'destructive'}
      className="flex items-center gap-2 mb-4"
      aria-live="polite"
    >
      {type === 'info' ? (
        <Info className="w-5 h-5 text-muted-foreground" />
      ) : (
        <AlertCircle className="w-5 h-5 text-destructive" />
      )}
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  )
}
