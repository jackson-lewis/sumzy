import { prisma } from '@/lib/prisma'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const userId = req.headers.get('x-user-id')

  if (!userId) {
    return NextResponse.json({
      message: 'Unauthorized'
    }, { status: 401 })
  }

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
}