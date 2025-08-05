import Link from 'next/link'
import { Transaction } from '@prisma/client'
import { useCategories } from '@/lib/swr'
import { getTransactionCategory } from '@/lib/transactions'
import Money from '@/components/global/money'
import { Skeleton } from '@/components/shared/skeleton'

export default function TransactionItem({
  transaction
}: {
  transaction: Transaction
}) {
  const { data: categories } = useCategories()
  const category = getTransactionCategory(
    transaction,
    categories?.defaultCategories,
    categories?.userCategories
  )

  const amount = Number(transaction.amount)

  return (
    <div className="rounded-lg bg-background shadow-sm border px-4 py-3 hover:bg-accent transition">
      <Link
        href={`/dashboard/transactions/view/${transaction.id}`}
        className="block"
      >
        <div className="flex gap-2 items-center">
          <Money
            amount={amount * (amount > 0 ? 1 : -1)}
            className={amount > 0 ? 'text-green-500' : ''}
          />
          <p className="text-sm text-foreground/80">
            {transaction.description}
          </p>
          {!!category && (
            <span className="inline-block rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
              {category?.name}
            </span>
          )}
        </div>
      </Link>
    </div>
  )
}

export function TransactionItemSkeleton() {
  return (
    <div className="rounded-lg bg-background shadow-sm border px-4 py-3 flex flex-col gap-2">
      <Skeleton variant="text" style={{ width: 100 }} />
      <Skeleton
        variant="text"
        style={{ width: 60, '--font-size': '1.125rem' }}
      />
    </div>
  )
}
