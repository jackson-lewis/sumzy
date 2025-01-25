import Link from 'next/link'
import { Transaction } from '@prisma/client'
import { useCategories } from '@/lib/swr'
import { getTransactionCategory } from '@/lib/transactions'
import Money from '@/components/global/money'
import { Skeleton } from '@/components/shared/skeleton'
import styles from './style.module.scss'

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

  return (
    <div className={styles.transaction}>
      <Link href={`/dashboard/transactions/view/${transaction.id}`}>
        <div>
          <Money amount={Number(transaction.amount)} />
          {!!category && <p className={styles.category}>{category?.name}</p>}
        </div>
      </Link>
    </div>
  )
}

export function TransactionItemSkeleton() {
  return (
    <div className={styles.expense}>
      <Skeleton
        variant="text"
        style={{
          width: 100
        }}
      />
      <Skeleton
        variant="text"
        style={{
          width: 60,
          '--font-size': '1.125rem'
        }}
      />
    </div>
  )
}
