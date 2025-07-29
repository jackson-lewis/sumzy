import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { decrypt } from '@/lib/session'

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookie = (await cookies()).get('session')?.value
  const session = await decrypt(cookie)
  const userId = session?.userId || 1
  const { id } = await params

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const snapshotId = Number(id)
  if (!snapshotId || isNaN(snapshotId)) {
    return NextResponse.json({ error: 'Invalid snapshot id' }, { status: 400 })
  }
  // Only allow deleting user's own snapshot
  const snapshot = await prisma.netWorthSnapshot.findUnique({
    where: { id: snapshotId, userId: Number(userId) }
  })
  if (!snapshot) {
    return NextResponse.json({ error: 'Snapshot not found' }, { status: 404 })
  }
  // Delete balances first if necessary (if not cascading)
  await prisma.accountBalance.deleteMany({
    where: { netWorthSnapshotId: snapshotId }
  })
  await prisma.netWorthSnapshot.delete({ where: { id: snapshotId } })
  return NextResponse.json({ success: true })
}
