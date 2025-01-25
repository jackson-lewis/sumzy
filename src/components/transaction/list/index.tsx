'use client'

import { Transaction } from '@prisma/client'
import { useTx } from '@/lib/swr'
import { groupTransactionsByDay } from '@/lib/transactions'
import TransactionItem, { TransactionItemSkeleton } from '../item'
import styles from './style.module.scss'

export function DayGroup({
  day,
  transactions
}: {
  day: string
  transactions: Transaction[]
}) {
  const date = new Date(day)
  const weekday = date.toLocaleDateString(undefined, { weekday: 'long' })
  const dayMonth = date.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'long'
  })
  const dateRender = `${weekday}, ${dayMonth}`
  return (
    <>
      <span className={styles.date}>{dateRender}</span>
      <div className={styles.list}>
        {transactions.map((transaction) => (
          <TransactionItem key={transaction.id} transaction={transaction} />
        ))}
      </div>
    </>
  )
}

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

  const groupedTransactions = groupTransactionsByDay(data)

  return (
    <>
      {Object.keys(groupedTransactions).map((date) => (
        <DayGroup
          key={date}
          day={date}
          transactions={groupedTransactions[date]}
        />
      ))}
    </>
  )
}
