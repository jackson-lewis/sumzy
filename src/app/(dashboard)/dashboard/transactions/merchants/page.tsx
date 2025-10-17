import { Suspense } from 'react'
import CreateMerchantForm from '@/components/merchants/create-merchant-form'
import MerchantsList from '@/components/merchants/merchants-list'
import PageHeader from '@/components/ui/page-header'

export default function MerchantsPage() {
  return (
    <>
      <PageHeader
        title="Merchants"
        backHref="/dashboard/transactions"
        action={<CreateMerchantForm />}
      />
      <Suspense>
        <MerchantsList />
      </Suspense>
    </>
  )
}
