'use client'

import { useTx } from '@/lib/swr'
import TransactionItem, { TransactionItemSkeleton } from '../item'
import styles from './style.module.scss'

export default function TransactionsList() {
  const { data, isLoading } = useTx()

  if (isLoading) {
    return (
      <div className={styles.list}>
        <TransactionItemSkeleton />
      </div>
    )
  }

  if (!data || data.length === 0) {
    return <p>No transactions found.</p>
  }

  return (
    <div className={styles.list}>
      {data?.map((transaction) => (
        <TransactionItem key={transaction.id} transaction={transaction} />
      ))}
    </div>
  )
}
