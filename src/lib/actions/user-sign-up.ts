'use server'

import { redirect } from 'next/navigation'
import { sendUserVerifyEmail } from '@/services/notification/user'
import { generateEmailVerifyLink } from '@/services/user/token'
import { SignUpActionResponse, SignUpFormData } from '@/types/user'
import bcrypt from 'bcrypt'
import { z } from 'zod'
import { prisma } from '../prisma'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/i, 'Password must contain at least one uppercase letter')
    .regex(/\d/, 'Password must contain at least one number')
    .regex(
      /[^a-zA-Z0-9]/,
      'Password must contain at least one special character'
    )
})

export async function signUp(
  _: SignUpActionResponse,
  formData: FormData
): Promise<SignUpActionResponse> {
  const data: SignUpFormData = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    password_confirm: formData.get('password_confirm') as string
  }

  const validatedFields = schema.safeParse(data)

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Please fix the errors in the form',
      inputs: data,
      errors: validatedFields.error.flatten().fieldErrors
    }
  }

  if (data.password !== data.password_confirm) {
    return {
      success: false,
      message: 'Passwords do not match',
      inputs: data
    }
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      email: data.email
    }
  })

  if (existingUser) {
    return {
      success: false,
      inputs: data,
      message: 'Email address already in use'
    }
  }

  const hash = bcrypt.hashSync(data.password, 10)

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hash
    }
  })

  const emailVerifyLink = await generateEmailVerifyLink(user)
  await sendUserVerifyEmail({ ...user, emailVerifyLink })

  redirect('/sign-up/verify-email')
}
