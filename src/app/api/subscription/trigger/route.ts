import { NextResponse } from 'next/server'
import { FrequencyType } from '@prisma/client'
import { prisma } from '@/lib/prisma'

console.log('[CRON] Subscription trigger started')

// POST /api/subscription/trigger
export async function GET() {
  // Get today's day of month
  const today = new Date()
  const dayOfMonth = today.getDate()

  // Find all subscriptions with frequency DATE_OF_MONTH
  const subscriptions = await prisma.subscription.findMany({
    where: {
      frequency: FrequencyType.DATE_OF_MONTH
    },
    include: {
      originTransaction: true
    }
  })

  console.log(
    `Found ${subscriptions.length} subscriptions with frequency DATE_OF_MONTH`
  )

  // Filter subscriptions where the origin transaction's day matches today
  const matchingSubs = subscriptions.filter((sub) => {
    if (!sub.originTransaction?.date) return false
    const originDay = new Date(sub.originTransaction.date).getDate()
    return originDay === dayOfMonth
  })
  console.log(
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
    console.log(
      `Created transaction for subscription ${sub.id} (user ${sub.userId})`
    )
  }

  return NextResponse.json({ created: createdCount })
}
