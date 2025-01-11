import CategoryLink from '@/components/transaction/category'
import FrequencySelector from '@/components/transaction/frequency-selector'
import TransactionsList from '@/components/transaction/list'
import { Suspense } from 'react'

export default function Expenses() {
  return (
    <>
      <h1>Expenses</h1>
      <CategoryLink />
      <Suspense>
        <FrequencySelector direction="expense" />
        <TransactionsList />
      </Suspense>
    </>
  )
}