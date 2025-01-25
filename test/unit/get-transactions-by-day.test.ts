import { Transaction } from '@prisma/client'
import { groupTransactionsByDay } from '@/lib/transactions'
import { transaction } from '../seeding'

describe('Group transactions by day', () => {
  it('should return transactions grouped by day', () => {
    const transaction2 = {
      ...transaction,
      id: 2,
      date: new Date('2024-11-29')
    }
    const transaction3 = {
      ...transaction,
      id: 3,
      date: new Date('2024-11-30')
    }
    const transactions: Transaction[] = [
      transaction,
      transaction2,
      transaction3
    ]
    const result = groupTransactionsByDay(transactions)

    expect(result).toEqual({
      '2024-11-29': [transaction, transaction2],
      '2024-11-30': [transaction3]
    })
  })
})
