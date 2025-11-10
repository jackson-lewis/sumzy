import { NextResponse } from 'next/server'
import { FrequencyType } from '@prisma/client'
import * as Sentry from '@sentry/nextjs'
import { prisma } from '@/lib/prisma'

const { logger } = Sentry

const monitorSlug = 'create-transactions-from-subscriptions'

export async function GET() {
  const checkInId = Sentry.captureCheckIn({
    monitorSlug,
    status: 'in_progress'
  })

  const today = new Date()
  const dayOfMonth = today.getDate()

  const subscriptions = await prisma.subscription.findMany({
    where: {
      frequency: FrequencyType.DATE_OF_MONTH
    }
  })

  logger.info(
    logger.fmt`Found ${subscriptions.length} subscriptions with frequency DATE_OF_MONTH`
  )

  const matchingSubs = subscriptions.filter((sub) => {
    if (!sub.date) return false
    const subDay = new Date(sub.date).getDate()
    return subDay === dayOfMonth
  })

  logger.info(
    logger.fmt`Found ${matchingSubs.length} subscriptions match today's day (${dayOfMonth})`
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
        subscriptionId: sub.id,
        merchantId: sub.merchantId
      }
    })
    createdCount++
    logger.info(
      logger.fmt`Created transaction for subscription ${sub.id} (user ${sub.userId})`
    )
  }

  Sentry.captureCheckIn({
    checkInId,
    monitorSlug,
    status: 'ok'
  })

  return NextResponse.json({ created: createdCount })
}
