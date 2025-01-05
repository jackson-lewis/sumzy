import AddCategory from '@/components/categories/add'
import CategoriesList from '@/components/categories/list'
import { Suspense } from 'react'

export default function TransactionCategories() {
  return (
    <>
      <h1>Categories</h1>
      <Suspense>
        <AddCategory />
        <CategoriesList />
      </Suspense>
    </>
  )
}