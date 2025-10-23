'use server'

import { Prisma, Transaction } from '@prisma/client'
import * as Sentry from '@sentry/nextjs'
import { prisma } from '@/lib/prisma'
import { apiRequest } from '../api'

const { logger } = Sentry

export async function transactionAction(
  prevState: unknown,
  formData: FormData
) {
  const data = Object.fromEntries(
    formData.entries()
  ) as unknown as Transaction & { direction: string }
  const { direction, ...transaction } = data
  const update = formData.get('update')

  logger.info('Creating transaction')

  if (direction === 'expense') {
    logger.info(
      logger.fmt`Transaction is expense, converting ${transaction.amount} to negative.`
    )
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

export async function deleteTransaction(transactionId: number) {
  // You may want to add session/cookie validation here if needed
  await prisma.transaction.delete({
    where: { id: transactionId }
  })
  return { success: true }
}
