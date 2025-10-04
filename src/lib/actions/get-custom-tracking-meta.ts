'use server'

import { prisma } from '@/lib/prisma'

export async function getCustomTrackingMeta(trackId: number) {
  const data = await prisma.customTrackingMeta.findMany({
    where: { trackId },
    orderBy: { date: 'asc' },
    select: {
      date: true,
      amount: true
    }
  })

  return JSON.parse(JSON.stringify(data)) as typeof data
}
