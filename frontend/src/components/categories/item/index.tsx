import { Category } from '@/types'
import { deleteCategory } from '@/lib/category'

export default function CategoryItem({
  category
} : {
  category: Category,
}) {
  async function handleDeleteClick() {
    const { error } = await deleteCategory(category.id)
    if (error) {
      console.error(error)
    }
  }

  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
      <p>{category.name}</p>
      <button onClick={handleDeleteClick}>delete</button>
    </div>
  )
}
