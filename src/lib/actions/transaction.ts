'use server'

import { TransactionDirection } from '@/types'
import { Prisma, Transaction } from '@prisma/client'
import { apiRequest } from '../api'

export async function transactionAction(
  prevState: unknown,
  formData: FormData
) {
  const data = Object.fromEntries(formData.entries()) as unknown as Transaction
  const direction = formData.get('direction') as TransactionDirection
  const update = formData.get('update')

  if (direction === 'expense') {
    data.amount = new Prisma.Decimal(Number(data.amount) * -1)
  }

  const response = await apiRequest<Transaction>(
    'v1/transactions',
    {
      method: update === 'true' ? 'PATCH' : 'POST',
      body: JSON.stringify(data)
    },
    true
  )

  if (response.error) {
    return response.error
  }

  return response.data
}
