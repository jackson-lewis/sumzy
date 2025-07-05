import { cookies } from 'next/headers'
import { prisma } from './prisma'
import { decrypt } from './session'

export async function getCustomTrackings() {
  const cookie = (await cookies()).get('session')?.value
  const session = await decrypt(cookie)
  if (!session) {
    throw new Error('Session not found')
  }
  try {
    const data = await prisma.customTracking.findMany({
      where: {
        userId: Number(session.userId)
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    return data
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message)
    }
    throw new Error('An unexpected error occurred.')
  }
}

export async function getCustomTracking(slug: string) {
  const cookie = (await cookies()).get('session')?.value
  const session = await decrypt(cookie)

  if (!session) {
    throw new Error('Session not found')
  }

  try {
    const data = await prisma.customTracking.findMany({
      where: {
        slug,
        userId: Number(session.userId)
      }
    })

    if (!data) {
      throw new Error('Custom tracking not found')
    }

    return data[0]
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message)
    }
    throw new Error('An unexpected error occurred.')
  }
}
