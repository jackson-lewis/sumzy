import { type NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const userId = req.headers.get('x-user-id')

  if (!userId) {
    return NextResponse.json(
      {
        message: 'Unauthorized'
      },
      { status: 401 }
    )
  }

  try {
    const defaultCategories = await prisma.defaultCategory.findMany()
    const userCategories = await prisma.category.findMany({
      where: {
        userId: Number(userId)
      }
    })

    return NextResponse.json({
      defaultCategories,
      userCategories
    })
  } catch (error) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : 'An error occurred'
      },
      { status: 400 }
    )
  }
}
