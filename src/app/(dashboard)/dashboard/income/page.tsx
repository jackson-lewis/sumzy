import { Suspense } from 'react'
import CategoryLink from '@/components/transaction/category'
import FrequencySelector from '@/components/transaction/frequency-selector'
import TransactionsList from '@/components/transaction/list'

export default function Incmoe() {
  return (
    <>
      <h1>Income</h1>
      <CategoryLink />
      <Suspense>
        <FrequencySelector direction="income" />
        <TransactionsList />
      </Suspense>
    </>
  )
}
