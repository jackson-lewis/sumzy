import clsx from 'clsx'
import { formatAmount } from '@/lib/money'

export default function Money({
  amount,
  className = ''
}: {
  amount: number
  className?: string
}) {
  const formatted = formatAmount(amount)

  return (
    <span className={clsx('font-mono text-base text-foreground', className)}>
      {formatted}
    </span>
  )
}
