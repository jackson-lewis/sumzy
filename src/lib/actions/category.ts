'use server'

import { cookies } from 'next/headers'
import { prisma } from '../prisma'
import { decrypt } from '../session'

export async function createCategory(prevState: unknown, formData: FormData) {
  const name = formData.get('name') as string
  const cookie = (await cookies()).get('session')?.value
  const session = await decrypt(cookie)

  try {
    const data = await prisma.category.create({
      data: {
        userId: Number(session?.userId),
        name
      }
    })

    return {
      success: true,
      data
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return {
      success: false
    }
  }
}
