'use client'

import CategoryItem from '../item'
import { useCategories } from '@/lib/swr'

export default function CategoriesList() {
  const { data } = useCategories()

  if (!data || data.userCategories.length === 0) {
    return (
      <p>Your categories will show up here.</p>
    )
  }

  return (
    <div>
      {data.userCategories.map((category) => (
        <CategoryItem
          key={category.id}
          category={category}
        />
      ))}
    </div>
  )
}