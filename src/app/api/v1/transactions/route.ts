import { type NextRequest, NextResponse } from 'next/server'
import { storeEvent } from '@/services/reporting/event'
import { generateReport } from '@/services/reporting/generate'
import { TransactionDirection } from '@/types'
import { CategoryType, Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const userId = req.headers.get('x-user-id') as string
  const {
    amount,
    categoryId,
    categoryType,
    date,
    description,
    merchantId
  }: {
    categoryType: CategoryType
    categoryId: string
    [k: string]: string
  } = await req.json()

  const trueDate = new Date(date)

  try {
    const trueCategoryId = categoryId.replace(/^(d|u)/, '')
    const transaction = await prisma.transaction.create({
      data: {
        userId: Number(userId),
        amount: new Prisma.Decimal(amount),
        categoryType,
        categoryId:
          categoryType === CategoryType.USER ? Number(trueCategoryId) : null,
        defaultCategoryId:
          categoryType === CategoryType.DEFAULT ? Number(trueCategoryId) : null,
        date: trueDate.toISOString() as unknown as Date,
        description,
        merchantId: Number(merchantId)
      }
    })

    await storeEvent(transaction, 'CREATED')
    await generateReport(
      Number(userId),
      trueDate.getFullYear(),
      trueDate.getMonth() + 1
    )

    return NextResponse.json(transaction, { status: 201 })
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 400 }
    )
  }
}

function formatDate(raw: string) {
  const match = raw.match(/(?:-|\/)/)

  if (match) {
    const segments = raw.split(match[0])

    if (segments.length === 3) {
      const [Y, M, D] = segments.map(Number)
      return new Date(Y, M - 1, D)
    }
  }

  if (/^[0-9]{13}$/.test(raw)) {
    return new Date(Number(raw))
  }

  return false
}

export async function GET(request: NextRequest) {
  const userId = request.headers.get('x-user-id')
  const searchParams = request.nextUrl.searchParams
  const direction = searchParams.get('direction') as TransactionDirection
  const from = searchParams.get('from')
  const to = searchParams.get('to')

  const where: Prisma.TransactionWhereInput = {
    userId: Number(userId)
  }

  if (direction === 'expense') {
    where.amount = {
      lt: 0
    }
  } else if (direction === 'income') {
    where.amount = {
      gt: 0
    }
  }

  /**
   * Support unix time stamp and YYYY-MM-DD or YYYY/MM/DD
   */
  if (from && to) {
    const fromDate = formatDate(from)
    const toDate = formatDate(to)

    if (fromDate && toDate) {
      toDate.setHours(23, 59, 59, 999)

      where.date = {
        gte: fromDate.toISOString(),
        lt: toDate.toISOString()
      }
    }
  }

  try {
    const transactions = await prisma.transaction.findMany({
      where,
      orderBy: {
        date: 'desc'
      }
    })

    return NextResponse.json(transactions)
  } catch (error) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 400 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  const {
    id,
    amount,
    categoryId,
    categoryType,
    description,
    date
  }: {
    categoryType: CategoryType
    [k: string]: string
  } = await request.json()
  const userId = request.headers.get('x-user-id') as string
  const trueDate = new Date(date)
  const trueCategoryId = categoryId.replace(/^(d|u)/, '')

  const transaction = await prisma.transaction.update({
    where: {
      id: Number(id),
      userId: Number(userId)
    },
    data: {
      amount: Number(amount),
      categoryType,
      categoryId:
        categoryType === CategoryType.USER ? Number(trueCategoryId) : null,
      defaultCategoryId:
        categoryType === CategoryType.DEFAULT ? Number(trueCategoryId) : null,
      description,
      date: trueDate
    }
  })

  await storeEvent(transaction, 'UPDATED')
  await generateReport(
    Number(userId),
    trueDate.getFullYear(),
    trueDate.getMonth() + 1
  )

  return NextResponse.json(transaction)
}

export async function DELETE(request: NextRequest) {
  const userId = request.headers.get('x-user-id') as string
  const searchParams = request.nextUrl.searchParams
  const id = searchParams.get('id')

  const transaction = await prisma.transaction.delete({
    where: {
      id: Number(id),
      userId: Number(userId)
    }
  })

  const date = new Date(transaction.date)

  await storeEvent(transaction, 'DELETED')
  await generateReport(Number(userId), date.getFullYear(), date.getMonth() + 1)

  return NextResponse.json(transaction)
}
