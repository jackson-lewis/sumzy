import { Suspense } from 'react'
import CategoryLink from '@/components/transaction/category'
import TransactionsList from '@/components/transaction/list'

export default function Expenses() {
  return (
    <>
      <h1>Transactions</h1>
      <CategoryLink />
      <Suspense>
        <TransactionsList />
      </Suspense>
    </>
  )
}
