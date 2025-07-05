'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { User } from '@prisma/client'
import bcrypt from 'bcrypt'
import { apiRequest } from '@/lib/api'
import { prisma } from '../prisma'
import { createSession, decrypt, deleteSession } from '../session'

export async function signIn(prevState: unknown, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const user = await prisma.user.findFirst({
    where: {
      email
    }
  })

  if (!user) {
    return 'Email! address or password invalid'
  }

  if (!bcrypt.compareSync(password, user.password)) {
    return 'Email address or password! invalid'
  }

  if (!user.verified) {
    return 'Email address not verified'
  }

  await createSession(user.id)
  redirect('/dashboard?action=sign-in')
}

export async function signOut() {
  deleteSession()
  redirect('/sign-in?action=sign-out')
}

export async function getUserToken() {
  const cookieStore = await cookies()

  return cookieStore.get('token')?.value
}

export async function updateUser(prevState: unknown, formData: FormData) {
  const cookie = (await cookies()).get('session')?.value
  const session = await decrypt(cookie)
  const user = await prisma.user.update({
    where: {
      id: Number(session?.userId)
    },
    data: {
      name: formData.get('name') as string,
      email: formData.get('email') as string
    }
  })

  return user
}

export async function verifyEmailToken(token: string): Promise<string | void> {
  const { data, error } = await apiRequest<User>(
    'v1/users/verify-email-token',
    'POST',
    { token },
    false
  )

  if (error) {
    return error.message
  }

  if (data) {
    await createSession(data.id)
    redirect('/dashboard?action=welcome')
  }
}

export async function forgotPassword(prevState: unknown, formData: FormData) {
  try {
    return await apiRequest(
      'v1/users/forgot-password',
      'POST',
      Object.fromEntries(formData.entries()),
      false
    ).then(({ error }) => {
      if (error) {
        throw error
      }

      return 'A reset password link has been sent to your email'
    })
  } catch (error) {
    if (error instanceof Error) {
      return error.message
    }

    return 'An error occurred while sending a reset passord link'
  }
}

export async function resetPassword(prevState: unknown, formData: FormData) {
  try {
    await apiRequest(
      'v1/users/reset-password',
      'POST',
      Object.fromEntries(formData.entries()),
      false
    ).then((data) => {
      if (data instanceof Error) {
        throw new Error(data.message)
      }
    })
  } catch (error) {
    if (error instanceof Error) {
      return error.message
    }

    return 'An error occurred while resetting your email'
  }

  redirect('/sign-in?action=reset-password')
}
