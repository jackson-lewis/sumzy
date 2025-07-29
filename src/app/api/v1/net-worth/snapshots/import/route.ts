import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { parse } from 'csv-parse/sync'
import { prisma } from '@/lib/prisma'
import { decrypt } from '@/lib/session'

export async function POST(req: Request) {
  const cookie = (await cookies()).get('session')?.value
  const session = await decrypt(cookie)
  const userId = session ? Number(session.userId) : 1

  if (!session) {
    // return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let text = ''
  const contentType = req.headers.get('content-type') || ''
  if (contentType.includes('multipart/form-data')) {
    // Not supported in edge runtime, but left for reference
    // const formData = await req.formData()
    // const file = formData.get('file') as File
    // if (!file) {
    //   return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    // }
    // text = await file.text()
    return NextResponse.json(
      { error: 'multipart/form-data not supported on edge runtime' },
      { status: 400 }
    )
  } else if (
    contentType.includes('application/octet-stream') ||
    contentType.includes('text/csv')
  ) {
    // Read raw body as text
    text = await req.text()
  } else {
    return NextResponse.json(
      { error: 'Unsupported content-type' },
      { status: 400 }
    )
  }

  // Parse CSV: first column is accountId, first row is dates
  const records = parse(text, { skip_empty_lines: true })
  if (records.length < 2) {
    return NextResponse.json(
      { error: 'CSV must have at least one row and one column' },
      { status: 400 }
    )
  }
  const header = records[0]
  const dateColumns = header.slice(1)
  const accountRows = records.slice(1)

  // Prepare snapshot data
  const snapshotsByDate: Record<
    string,
    {
      userId: number
      snapshotDate: Date
      balances: { accountId: number; balance: number }[]
    }
  > = {}
  for (const row of accountRows) {
    const accountId = Number(row[0])
    for (let i = 1; i < row.length; i++) {
      const date = dateColumns[i - 1]
      const balance = Number(row[i])
      if (!snapshotsByDate[date]) {
        snapshotsByDate[date] = {
          userId: Number(userId),
          snapshotDate: new Date(date),
          balances: []
        }
      }
      snapshotsByDate[date].balances.push({ accountId, balance })
    }
  }

  // Upsert snapshots and balances
  for (const date of Object.keys(snapshotsByDate)) {
    const { userId, snapshotDate, balances } = snapshotsByDate[date]
    // Upsert snapshot
    const snapshot = await prisma.netWorthSnapshot.upsert({
      where: { userId_snapshotDate: { userId, snapshotDate } },
      update: {},
      create: {
        userId,
        snapshotDate,
        balances: { createMany: { data: balances } }
      },
      include: { balances: true }
    })
    // If balances already exist, replace them
    if (snapshot.balances.length > 0) {
      await prisma.accountBalance.deleteMany({
        where: { netWorthSnapshotId: snapshot.id }
      })
      await prisma.accountBalance.createMany({
        data: balances.map((b) => ({ ...b, netWorthSnapshotId: snapshot.id }))
      })
    }
  }

  return NextResponse.json({ success: true })
}
