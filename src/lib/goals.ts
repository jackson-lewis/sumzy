'use server'

import { cookies } from 'next/headers'
import { prisma } from './prisma'
import { decrypt } from './session'

export async function getGoals() {
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

export async function getGoal(slug: string) {
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
      throw new Error('Goal not found')
    }

    return JSON.parse(JSON.stringify(data[0])) as (typeof data)[0]
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message)
    }
    throw new Error('An unexpected error occurred.')
  }
}

export async function deleteGoal(id: number) {
  const cookie = (await cookies()).get('session')?.value
  const session = await decrypt(cookie)

  if (!session) {
    throw new Error('Session not found')
  }

  try {
    const deleted = await prisma.customTracking.deleteMany({
      where: {
        id,
        userId: Number(session.userId)
      }
    })

    if (deleted.count === 0) {
      throw new Error('Goal not found or not deleted')
    }

    return deleted
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message)
    }
    throw new Error('An unexpected error occurred.')
  }
}
