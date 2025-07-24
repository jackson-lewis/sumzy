import Link from 'next/link'
import { cn } from '@/lib/utils'

interface BackButtonProps {
  href: string
  className?: string
}

export function BackButton({ href, className }: BackButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        'inline-flex items-center justify-center text-base font-medium size-9 gap-2 rounded-md hover:bg-muted transition-colors',
        className
      )}
      aria-label="Go back"
    >
      <svg
        className="h-6 w-6 text-muted-foreground"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 19l-7-7 7-7"
        />
      </svg>
    </Link>
  )
}
