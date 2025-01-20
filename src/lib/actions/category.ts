'use server'

import { cookies } from 'next/headers'
import { prisma } from '../prisma'
import { decrypt } from '../session'

export async function createCategory(prevState: unknown, formData: FormData) {
  const name = formData.get('name') as string
  const cookie = (await cookies()).get('session')?.value
  const session = await decrypt(cookie)

  try {
    return await prisma.category.create({
      data: {
        userId: Number(session?.userId),
        name
      }
    })
  } catch (error) {
    console.log(error)
    // if (error instanceof && error.code === 11000) {
    //   return {
    //     message: `Category "${name}" already exists`
    //   }
    // }
  }
}
