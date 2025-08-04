import { formatAmount } from '@/lib/money'

export default function Money({ amount }: { amount: number }) {
  const formatted = formatAmount(amount)

  return (
    <span className="font-mono text-base text-foreground">{formatted}</span>
  )
}
