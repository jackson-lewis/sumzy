import { NextRequest, NextResponse } from 'next/server'
import { ReportGenerator } from '@/services/reporting/generate'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const userId = req.headers.get('x-user-id')
  const searchParams = req.nextUrl.searchParams
  const year = searchParams.get('year')
  const month = searchParams.get('month')
  const date = new Date(Number(year), Number(month) - 1)

  const report = await prisma.report.findFirst({
    where: {
      userId: Number(userId),
      date
    }
  })

  if (report) {
    return NextResponse.json(report)
  }

  return NextResponse.json(
    { message: 'Report not found' },
    {
      status: 400
    }
  )
}

export async function POST(req: NextRequest) {
  const userId = req.headers.get('x-user-id')
  const searchParams = req.nextUrl.searchParams
  const year = searchParams.get('year')
  const month = searchParams.get('month')

  if (!userId) {
    return NextResponse.json(
      { message: 'Unauthorized' },
      {
        status: 401
      }
    )
  }

  const generator = new ReportGenerator(
    Number(userId),
    Number(year),
    Number(month)
  )

  return NextResponse.json(await generator.generate())
}
