import { Loader2Icon } from 'lucide-react'
import { useFormStatus } from 'react-dom'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export default function SubmitButton({
  children,
  className,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      disabled={pending}
      {...rest}
      className={cn('relative', className)}
    >
      {children}
      {pending && (
        <div className="absolute inset-0 flex items-center justify-center bg-white rounded-md">
          <Loader2Icon className="animate-spin h-8 w-8 text-black" />
        </div>
      )}
    </Button>
  )
}
