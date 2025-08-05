'use server'

import { Prisma, Transaction } from '@prisma/client'
import { apiRequest } from '../api'

export async function transactionAction(
  prevState: unknown,
  formData: FormData
) {
  const data = Object.fromEntries(
    formData.entries()
  ) as unknown as Transaction & { direction: string }
  const { direction, ...transaction } = data
  const update = formData.get('update')

  if (direction === 'expense') {
    transaction.amount = new Prisma.Decimal(Number(transaction.amount) * -1)
  }

  const response = await apiRequest<Transaction>(
    'v1/transactions',
    {
      method: update === 'true' ? 'PATCH' : 'POST',
      body: JSON.stringify(transaction)
    },
    true
  )

  if (response.error) {
    return response.error
  }

  return response.data
}
