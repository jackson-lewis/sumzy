'use server'

import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { decrypt } from '../session'

export async function createMerchant(_: unknown, formData: FormData) {
  const name = formData.get('name') as string
  if (!name) return { success: false, error: 'Name required' }
  try {
    const merchant = await prisma.merchant.create({
      data: { name }
    })
    return { success: true, data: merchant }
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to create merchant'
    }
  }
}

export async function favoriteMerchant(merchantId: number) {
  const cookie = (await cookies()).get('session')?.value
  const session = await decrypt(cookie)
  const userId = Number(session?.userId)

  // Get current favorites for this merchant
  const merchant = await prisma.merchant.findUnique({
    where: { id: merchantId },
    include: { favorites: { select: { id: true } } }
  })
  const isFavorited = merchant?.favorites.some((u) => u.id === userId)

  return await prisma.merchant.update({
    where: { id: merchantId },
    data: {
      favorites: isFavorited
        ? { disconnect: { id: userId } }
        : { connect: { id: userId } }
    }
  })
}
