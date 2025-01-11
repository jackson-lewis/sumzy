import { Category } from '@prisma/client'
import { prisma } from './prisma'



/**
 * Delete a category for the authenticated user.
 */
export async function deleteCategory(id: Category['id']) {
  const fnReturn: {
    category: Category | null,
    error: Error | null
  } = {
    category: null,
    error: null
  }

  try {
    fnReturn.category = await prisma.category.delete({
      where: {
        id
      }
    })
  } catch(error) {
    fnReturn.error = error instanceof Error ? error : new Error(
      'An error occurred while deleting the category.'
    )
  }
  

  return fnReturn
}