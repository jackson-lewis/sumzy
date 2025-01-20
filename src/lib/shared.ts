import { Transaction } from '@/types'

export function sortTransactionsByDate(a: Transaction, b: Transaction) {
  if (a.date > b.date) {
    return -1
  }

  if (a.date < b.date) {
    return 1
  }

  return 0
}
