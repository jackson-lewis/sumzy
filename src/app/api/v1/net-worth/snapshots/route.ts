import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { decrypt } from '@/lib/session'

export async function GET() {
  const cookie = (await cookies()).get('session')?.value
  const session = await decrypt(cookie)
  if (!session) {
    return NextResponse.json([], { status: 401 })
  }
  const snapshots = await prisma.netWorthSnapshot.findMany({
    where: { userId: Number(session.userId) },
    orderBy: { snapshotDate: 'asc' },
    include: {
      balances: {
        include: { account: true }
      }
    }
  })
  return NextResponse.json(snapshots)
}
