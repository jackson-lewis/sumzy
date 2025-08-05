'use client'

import { Transaction } from '@prisma/client'
import { useTx } from '@/lib/swr'
import { groupTransactionsByDay } from '@/lib/transactions'
import TransactionItem, { TransactionItemSkeleton } from '../item'

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
    <div className="mb-6">
      <span className="block text-xs font-semibold text-muted-foreground mb-2 ml-1">
        {dateRender}
      </span>
      <div className="flex flex-col gap-2">
        {transactions.map((transaction) => (
          <TransactionItem key={transaction.id} transaction={transaction} />
        ))}
      </div>
    </div>
  )
}

export default function TransactionsList() {
  const { data, isLoading } = useTx()

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
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
