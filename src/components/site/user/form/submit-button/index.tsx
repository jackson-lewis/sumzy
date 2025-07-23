import { Loader2Icon } from 'lucide-react'
import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'

export default function SubmitButton({
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending} {...rest} className="relative">
      {children}
      {pending && (
        <div className="absolute inset-0 flex items-center justify-center bg-white rounded-md">
          <Loader2Icon className="animate-spin h-8 w-8 text-black" />
        </div>
      )}
    </Button>
  )
}
