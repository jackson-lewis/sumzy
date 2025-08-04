import { Suspense } from 'react'
import Link from 'next/link'
import TransactionDialog from '@/components/transaction/dialog'
import TransactionsList from '@/components/transaction/list'
import { Button } from '@/components/ui/button'
import PageHeader from '@/components/ui/page-header'

export default function Expenses() {
  return (
    <>
      <PageHeader
        title="Transactions"
        backHref="/dashboard"
        action={<TransactionDialog />}
      />
      <Suspense>
        <TransactionsList />
      </Suspense>
      <div className="mt-4 flex justify-center">
        <Link href="/dashboard/transactions/categories">
          <Button variant="outline">Manage Categories</Button>
        </Link>
      </div>
    </>
  )
}
