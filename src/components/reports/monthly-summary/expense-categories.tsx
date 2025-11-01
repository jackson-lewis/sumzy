import { CategoryWithAmount } from '@/types'
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
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <dl className="grid grid-cols-2 gap-y-1 mb-6">
        {categories.map((category) => {
          if (category.amount === 0) {
            return null
          }

          return (
            <Fragment key={`${category.type}-${category.id}`}>
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
  categoryTotals: {
    [key: string]: number
  }
}) {
  const { data } = useCategories()

  if (!data?.userCategories || !categoryTotals) {
    return <p>Failed to load categories.</p>
  }

  const categories = Object.keys(categoryTotals)
    .map((categoryGuid) => {
      const [categoryType, categoryIdStr] = categoryGuid.split('-')
      const categoryId = Number(categoryIdStr)

      const category =
        categoryType === 'DEFAULT'
          ? data.defaultCategories.find((cat) => cat.id === categoryId)
          : data.userCategories.find((cat) => cat.id === categoryId)

      if (!category) {
        return {
          id: categoryId,
          name: 'Unknown',
          amount: categoryTotals[categoryGuid],
          type: categoryType
        }
      }

      return {
        ...category,
        amount: categoryTotals[categoryGuid],
        type: categoryType
      }
    })
    .sort((a, b) => {
      return a.amount > b.amount ? -1 : 1
    }) as CategoryWithAmount[]

  const grouped = [
    categories.find(
      (category) => category.type === 'USER' && category.id === 5
    ),
    categories.find(
      (category) => category.type === 'DEFAULT' && category.id === 4
    ),
    {
      id: 99,
      name: 'Spending',
      amount: categories.reduce((acc, category) => {
        const excluded = {
          DEFAULT: [1, 4, 6, 7],
          USER: [1, 5, 7]
        }

        return excluded[category.type as 'DEFAULT' | 'USER']?.includes(
          category.id
        )
          ? acc
          : acc + (category.amount || 0)
      }, 0)
    },
    {
      id: 98,
      name: 'Fixed',
      amount: categories.reduce((acc, category) => {
        const included = {
          DEFAULT: [1, 7],
          USER: [1]
        }

        return included[category.type as 'DEFAULT' | 'USER']?.includes(
          category.id
        )
          ? acc + (category.amount || 0)
          : acc
      }, 0)
    }
  ].filter(Boolean) as CategoryWithAmount[]

  return (
    <div>
      <CategoryGroup categories={grouped} title="Grouped" />
      <CategoryGroup categories={categories} title="Categories" />
    </div>
  )
}
