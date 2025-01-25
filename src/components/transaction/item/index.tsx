import Link from 'next/link'
import { Transaction } from '@prisma/client'
import { useCategories, useTx } from '@/lib/swr'
import {
  deleteTransaction,
  getTransactionCategory,
  txDirection
} from '@/lib/transactions'
import useTransactions from '@/lib/use-transactions'
import Date from '@/components/global/date'
import Money from '@/components/global/money'
import { Skeleton } from '@/components/shared/skeleton'
import styles from './style.module.scss'

export default function TransactionItem({
  transaction
}: {
  transaction: Transaction
}) {
  const { showEditModal } = useTransactions()
  const { data, mutate } = useTx()
  const { data: categories } = useCategories()
  const category = getTransactionCategory(
    transaction,
    categories?.defaultCategories,
    categories?.userCategories
  )

  async function handleDeleteClick() {
    const { data: deleteData, error } = await deleteTransaction(transaction.id)
    console.log({ deleteData, error })
    if (error) {
      return console.error(error.message)
    }

    if (!deleteData || !data) {
      return
    }

    const newTransactions = data.filter((tx) => {
      return tx.id !== deleteData.id
    })
    console.log('mutating')

    mutate(newTransactions, {
      optimisticData: newTransactions
    })
  }

  function handleUpdateClick() {
    showEditModal(txDirection(transaction), transaction.frequency, transaction)
  }

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
