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
  let message = 'Goal created successfully.'
  let success = false

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
    success = true
  } catch (error) {
    if (error instanceof Error) {
      message = error.message
    } else {
      message = 'An unexpected error occurred.'
    }
  }

  return {
    data,
    message,
    success
  }
}

export async function addEntry(
  { trackId }: { trackId: number },
  prevState: unknown,
  formData: FormData
): Promise<{
  data?: CustomTrackingMeta | undefined
  message: string
  success: boolean
}> {
  const date = formData.get('date') as string
  const amount = formData.get('amount') as string

  let data: CustomTrackingMeta | undefined
  let message = 'Entry added successfully.'
  let success = false

  try {
    data = await prisma.customTrackingMeta.create({
      data: {
        trackId,
        date: new Date(date),
        amount: Number(amount)
      }
    })
    success = true
  } catch (error) {
    if (error instanceof Error) {
      message = error.message
    } else {
      message = 'An unexpected error occurred.'
    }
  }

  return {
    data,
    message,
    success
  }
}
