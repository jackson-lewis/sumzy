import { NextRequest, NextResponse } from 'next/server'
import { CategoryType, Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'

// POST /api/v1/transactions/import
export async function POST(req: NextRequest) {
  // Parse multipart form
  const formData = await req.formData()
  const csvFile = formData.get('file')
  if (!csvFile || typeof csvFile === 'string') {
    return NextResponse.json({ error: 'Missing CSV file' }, { status: 400 })
  }

  // Build transactionProps from all non-file fields in formData
  const transactionProps: Record<string, string | number> = {}
  for (const [key, value] of formData.entries()) {
    if (key !== 'file') {
      if (key === 'categoryType') {
        transactionProps.categoryType =
          value === 'DEFAULT' ? CategoryType.DEFAULT : CategoryType.USER
      } else {
        transactionProps[key] =
          typeof Number(value) === 'number' ? Number(value) : (value as string)
      }
    }
  }

  // Read CSV
  const text = await csvFile.text()
  // Parse CSV: first row is headers (YYYY-MM), each row is a transaction, each cell is an amount
  const rows = text.trim().split(/\r?\n/)
  if (rows.length < 2) {
    return NextResponse.json(
      { error: 'CSV must have at least one header row and one data row' },
      { status: 400 }
    )
  }
  const headers = rows[0].split(',').map((h) => h.trim())
  const dataRows = rows.slice(1)

  let created = 0
  const perMonth: Record<string, { count: number; total: number }> = {}
  for (const row of dataRows) {
    const cells = row.split(',')
    for (let i = 0; i < headers.length; i++) {
      const month = headers[i]
      const value = cells[i]?.trim().replace('£', '')
      if (!value) continue

      const amount = -Math.abs(Number(value)) // always negative (expense)
      if (isNaN(amount)) continue

      // Set date to 1st of the month
      const date = new Date(month + '-01')
      if (isNaN(date.getTime())) continue

      await prisma.transaction.create({
        data: {
          userId: transactionProps.userId as number,
          categoryType: transactionProps.categoryType as CategoryType,
          categoryId:
            transactionProps.categoryType === CategoryType.USER
              ? (transactionProps.categoryId as number)
              : null,
          defaultCategoryId:
            transactionProps.categoryType === CategoryType.DEFAULT
              ? (transactionProps.defaultCategoryId as number)
              : null,
          merchantId: (transactionProps.merchantId as number) || null,
          description: transactionProps.description as string,
          amount: new Prisma.Decimal(amount),
          date
        }
      })

      created++
      if (!perMonth[month]) perMonth[month] = { count: 0, total: 0 }
      perMonth[month].count += 1
      perMonth[month].total += amount
    }
  }

  const perMonthArray = Object.entries(perMonth).map(
    ([month, { count, total }]) => ({ month, count, total })
  )
  return NextResponse.json({ created, perMonth: perMonthArray })
}
