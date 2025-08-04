import { Suspense } from 'react'
import AddCategory from '@/components/categories/add'
import CategoriesList from '@/components/categories/list'
import PageHeader from '@/components/ui/page-header'

export default function TransactionCategories() {
  return (
    <>
      <PageHeader
        title="Categories"
        backHref="/dashboard/transactions"
        action={<AddCategory />}
      />
      <Suspense>
        <CategoriesList />
      </Suspense>
    </>
  )
}
