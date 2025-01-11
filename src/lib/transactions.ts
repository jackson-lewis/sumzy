import { TransactionDirection } from '@/types'
import { apiRequest } from './api'
import { Category, DefaultCategory, Transaction } from '@prisma/client'

/**
 * Delete a transaction for the authenticated user.
 */
export async function deleteTransaction(id: Transaction['id']) {
  return await apiRequest<Transaction>(
    `v1/transactions?id=${id}`,
    'DELETE',
    undefined,
    true
  )
}

export function txDirection(
  transaction: Transaction
): TransactionDirection {
  return Number(transaction.amount) < 0 ? 'expense' : 'income'
}

/**
 * Get the category for the transaction
 */
export function getTransactionCategory(
  transaction: Transaction,
  defaultCategories: DefaultCategory[] | undefined,
  userCategories: Category[] | undefined
): Category | DefaultCategory | undefined {
  if (transaction.categoryType === 'USER') {
    return userCategories?.find((category) => {
      return category.id === transaction.categoryId
    })
  }

  return defaultCategories?.find((category) => {
    return category.id === transaction.defaultCategoryId
  })
}
