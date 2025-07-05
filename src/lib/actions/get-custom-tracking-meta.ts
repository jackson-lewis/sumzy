'use server'

import { prisma } from '@/lib/prisma'

export async function getCustomTrackingMeta(trackId: number) {
  return await prisma.customTrackingMeta.findMany({
    where: { trackId },
    orderBy: { date: 'asc' },
    select: {
      date: true,
      amount: true
    }
  })
}
