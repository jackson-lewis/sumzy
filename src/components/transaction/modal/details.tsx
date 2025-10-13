'use client'

import { useEffect, useState } from 'react'
import { Transaction } from '@prisma/client'
import { useCategories, useTx } from '@/lib/swr'
import { getTransactionCategory } from '@/lib/transactions'
import Money from '@/components/global/money'
import { Button } from '@/components/ui/button'
import CreateSubscriptionForm from './CreateSubscriptionForm'

export default function Details({ id }: { id: string }) {
  const { data: transactions, isLoading } = useTx()
  const { data: categories } = useCategories()
  const [transaction, setTransaction] = useState<Transaction | null>(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    if (transactions) {
      setTransaction(transactions.find((t) => String(t.id) === id) || null)
    }
  }, [transactions, id])

  if (isLoading) {
    return <div className="p-8 text-center">Loading...</div>
  }
  if (!transaction) {
    return (
      <div className="p-8 text-center text-destructive">
        Transaction not found.
      </div>
    )
  }

  const category = getTransactionCategory(
    transaction,
    categories?.defaultCategories,
    categories?.userCategories
  )

  return (
    <div className="p-8 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Money
          amount={Number(transaction.amount)}
          className={Number(transaction.amount) > 0 ? 'text-green-500' : ''}
        />
        <span className="text-muted-foreground text-sm">
          {transaction.description}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Category:</span>
        <span className="inline-block rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
          {category?.name || 'Uncategorized'}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Date:</span>
        <span className="text-xs">
          {new Date(transaction.date).toLocaleDateString('en-GB', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </span>
      </div>
      <div className="mt-6">
        {showForm ? (
          <CreateSubscriptionForm
            originTransactionId={transaction.id}
            onCreated={() => setShowForm(false)}
          />
        ) : (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setShowForm(true)}
          >
            Create Subscription
          </Button>
        )}
      </div>
    </div>
  )
}
