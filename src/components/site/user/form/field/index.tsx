import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'

export default function FormField({
  label,
  name,
  type,
  error,
  ...rest
}: {
  label: string
  error?: string[]
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const hasError = Array.isArray(error) && error.length > 0
  return (
    <div className={cn('mb-4 flex flex-col gap-1', hasError && 'text-red-600')}>
      <div className="flex justify-between items-center">
        <label
          htmlFor={name}
          className="block text-sm font-medium text-muted-foreground"
        >
          {label}
        </label>
        {name === 'password' && rest.autoComplete === 'current-password' && (
          <Link
            href="/sign-in/forgot-password"
            className="text-xs text-primary hover:underline"
          >
            Forgot password?
          </Link>
        )}
      </div>
      <Input
        type={type}
        name={name}
        id={name}
        aria-describedby={`${name}-error`}
        aria-invalid={hasError}
        data-testid={name}
        className={
          hasError
            ? 'border-red-600 focus:border-red-600 focus:ring-red-600'
            : ''
        }
        {...rest}
      />
      {hasError && (
        <p id={`${name}-error`} className="text-xs text-red-600 mt-1">
          {error![0]}
        </p>
      )}
    </div>
  )
}
