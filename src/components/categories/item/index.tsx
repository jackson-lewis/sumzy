import { Category } from '@prisma/client'
import { deleteCategory } from '@/lib/category'

export default function CategoryItem({ category }: { category: Category }) {
  async function handleDeleteClick() {
    const { error } = await deleteCategory(category.id)
    if (error) {
      console.error(error)
    }
  }

  return (
    <div className="flex items-center gap-3 py-2 px-3 mb-2 rounded bg-muted">
      <span className="text-base text-foreground flex-1">{category.name}</span>
      <button
        onClick={handleDeleteClick}
        className="px-2 py-1 text-xs rounded bg-destructive text-destructive-foreground hover:bg-destructive/80 transition"
        type="button"
      >
        Delete
      </button>
    </div>
  )
}
