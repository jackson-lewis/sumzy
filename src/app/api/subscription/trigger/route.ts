import { NextResponse } from 'next/server'
import { FrequencyType } from '@prisma/client'
import * as Sentry from '@sentry/nextjs'
import { prisma } from '@/lib/prisma'

const { logger } = Sentry

export async function GET() {
  const today = new Date()
  const dayOfMonth = today.getDate()

  const subscriptions = await prisma.subscription.findMany({
    where: {
      frequency: FrequencyType.DATE_OF_MONTH
    },
    include: {
      originTransaction: true
    }
  })

  logger.info(
    `Found ${subscriptions.length} subscriptions with frequency DATE_OF_MONTH`
  )

  const matchingSubs = subscriptions.filter((sub) => {
    if (!sub.originTransaction?.date) return false
    const originDay = new Date(sub.originTransaction.date).getDate()
    return originDay === dayOfMonth
  })

  logger.info(
    `${matchingSubs.length} subscriptions match today's day (${dayOfMonth})`
  )

  let createdCount = 0
  for (const sub of matchingSubs) {
    await prisma.transaction.create({
      data: {
        userId: sub.userId,
        amount: sub.amount,
        description: sub.description,
        categoryId: sub.categoryId,
        defaultCategoryId: sub.defaultCategoryId,
        categoryType: sub.categoryType,
        date: today,
        subscriptionId: sub.id
      }
    })
    createdCount++
    logger.info(
      `Created transaction for subscription ${sub.id} (user ${sub.userId})`
    )
  }

  return NextResponse.json({ created: createdCount })
}
