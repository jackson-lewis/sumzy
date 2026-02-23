import { type NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const userId = request.headers.get('x-user-id')

  if (!userId) {
    return NextResponse.json(
      { message: 'User ID is required' },
      { status: 401 }
    )
  }

  try {
    const subscriptions = await prisma.subscription.findMany({
      where: {
        userId: Number(userId)
      },
      include: {
        originTransaction: true,
        transactions: {
          orderBy: {
            date: 'desc'
          }
        },
        merchant: true
      },
      orderBy: {
        date: 'desc'
      }
    })

    return NextResponse.json(subscriptions)
  } catch (error) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 400 }
    )
  }
}
