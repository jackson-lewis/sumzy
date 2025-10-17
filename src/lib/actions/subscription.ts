'use server'

import { FrequencyType } from '@prisma/client'
import { prisma } from '@/lib/prisma'

export async function createSubscription({
  originTransactionId,
  frequency
}: {
  originTransactionId: number
  frequency: FrequencyType
}) {
  // Find the origin transaction
  const origin = await prisma.transaction.findUnique({
    where: { id: originTransactionId }
  })
  if (!origin) throw new Error('Origin transaction not found')
  // Create the subscription
  const subscription = await prisma.subscription.create({
    data: {
      userId: origin.userId,
      amount: origin.amount,
      description: origin.description,
      categoryId: origin.categoryId,
      defaultCategoryId: origin.defaultCategoryId,
      categoryType: origin.categoryType,
      merchantId: origin.merchantId,
      frequency,
      originTransactionId: origin.id
    }
  })
  return subscription
}
