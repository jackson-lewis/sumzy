import { CategoryWithAmount } from '@/types'
import { Category, CategoryType, DefaultCategory, Report } from '@prisma/client'
import { Fragment } from 'react/jsx-runtime'
import { useCategories } from '@/lib/swr'
import Money from '@/components/global/money'

function CategoryGroup({
  categories,
  title
}: {
  categories: CategoryWithAmount[]
  title: string
}) {
  return (
    <>
      <h2>{title}</h2>
      <dl className="grid grid-cols-2 gap-y-1">
        {categories.map((category) => {
          if (category.amount === 0) {
            return null
          }

          return (
            <Fragment key={category.id}>
              <dt className="pb-1 border-b border-[#ddd] last:border-b-0 last:pb-0">
                {category?.name}
              </dt>
              <dd className="pb-1 border-b border-[#ddd] last:border-b-0 last:pb-0 m-0">
                <Money amount={category.amount} />
              </dd>
            </Fragment>
          )
        })}
      </dl>
    </>
  )
}

export default function ExpenseCategories({
  categoryTotals
}: {
  categoryTotals: Report['tCategories']
}) {
  const { data } = useCategories()

  if (!data?.userCategories || !categoryTotals) {
    return <p>Failed to load categories.</p>
  }

  function getCategoriesWithAmount(
    categories: (Category | DefaultCategory)[],
    type: CategoryType
  ) {
    const marker = type.at(0)

    if (!categories || !marker) {
      return []
    }

    const modCategoryTotals = categoryTotals as unknown as {
      [k: string]: number
    }

    return categories
      .map((category) => {
        return {
          ...category,
          amount: modCategoryTotals[marker + category.id] || 0
        }
      })
      .sort((a, b) => {
        return a.amount > b.amount ? -1 : 1
      })
  }

  const defaultCategoriesWithAmount = getCategoriesWithAmount(
    data.defaultCategories,
    'DEFAULT'
  )

  const userCategoriesWithAmount = getCategoriesWithAmount(
    data.userCategories,
    'USER'
  )

  return (
    <div>
      <CategoryGroup
        categories={[
          ...defaultCategoriesWithAmount,
          ...userCategoriesWithAmount
        ]}
        title="Categories"
      />
    </div>
  )
}
