'use server'

import { prisma } from '@/lib/prisma'

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
