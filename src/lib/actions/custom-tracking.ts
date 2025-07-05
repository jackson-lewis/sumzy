'use server'

import { cookies } from 'next/headers'
import { CustomTrackingMeta } from '@prisma/client'
import { prisma } from '../prisma'
import { decrypt } from '../session'

export async function createCustomTracking(
  prevState: unknown,
  formData: FormData
) {
  const name = formData.get('name') as string
  const cookie = (await cookies()).get('session')?.value
  const session = await decrypt(cookie)

  let data
  let message

  try {
    data = prisma.customTracking.create({
      data: {
        userId: Number(session?.userId),
        name,
        slug: name
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '')
      }
    })
  } catch (error) {
    if (error instanceof Error) {
      message = error.message
    } else {
      message = 'An unexpected error occurred.'
    }
  }

  return {
    data,
    message
  }
}

export async function addEntry(
  { trackId }: { trackId: number },
  prevState: unknown,
  formData: FormData
): Promise<{ data?: CustomTrackingMeta | undefined; message?: string }> {
  const date = formData.get('date') as string
  const amount = formData.get('amount') as string

  let data: CustomTrackingMeta | undefined
  let message

  try {
    data = await prisma.customTrackingMeta.create({
      data: {
        trackId,
        date: new Date(date),
        amount: Number(amount)
      }
    })
  } catch (error) {
    if (error instanceof Error) {
      message = error.message
    } else {
      message = 'An unexpected error occurred.'
    }
  }

  return {
    data,
    message
  }
}
