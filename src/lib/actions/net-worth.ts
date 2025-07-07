'use server'

import { cookies } from 'next/headers'
import { prisma } from '../prisma'
import { decrypt } from '../session'

export async function createNetWorthAccount(
  prevState: unknown,
  formData: FormData
) {
  const cookie = (await cookies()).get('session')?.value
  const session = await decrypt(cookie)
  if (!session) {
    throw new Error('Session not found')
  }

  const name = formData.get('name') as string

  try {
    await prisma.account.create({
      data: {
        userId: Number(session.userId),
        name
      }
    })
    return { success: true }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export async function createNetWorthSnapshot(
  prevState: unknown,
  formData: FormData
) {
  const cookie = (await cookies()).get('session')?.value
  const session = await decrypt(cookie)
  if (!session) {
    return { success: false, error: 'Session not found' }
  }

  const snapshotDate = formData.get('date') as string
  // Collect all account balances from the form
  const balances: { accountId: number; balance: number }[] = []
  for (const [key, value] of formData.entries()) {
    if (key.startsWith('account-')) {
      const accountId = Number(key.replace('account-', ''))
      const balance = parseFloat(value as string)
      if (!isNaN(accountId) && !isNaN(balance)) {
        balances.push({ accountId, balance })
      }
    }
  }

  if (balances.length === 0) {
    return { success: false, error: 'No account balances provided' }
  }

  try {
    const snapshot = await prisma.netWorthSnapshot.create({
      data: {
        userId: Number(session.userId),
        snapshotDate: new Date(snapshotDate),
        balances: {
          create: balances.map((b) => ({
            accountId: b.accountId,
            balance: b.balance
          }))
        }
      },
      include: { balances: true }
    })
    return { success: true, snapshot }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}
