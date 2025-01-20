import { User } from '@prisma/client'
import { SignJWT, jwtVerify } from 'jose'

type Token = {
  userId: number
  action: 'sign_in' | 'reset_password' | 'verify_email'
}

const fp_secretKey = process.env.FORGOT_PASSWORD_SECRET
const fp_encodedKey = new TextEncoder().encode(fp_secretKey)
const ve_secretKey = process.env.VERIFY_EMAIL_SECRET
const ve_encodedKey = new TextEncoder().encode(ve_secretKey)

export async function generateEmailVerifyLink(user: User) {
  const token = await new SignJWT({
    userId: user.id,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('2d')
    .sign(ve_encodedKey)

  return `${process.env.FRONTEND_URL}/sign-up/verify-email?token=${token}`
}

export async function generateResetPasswordLink(user: User) {
  const token = await new SignJWT({
    userId: user.id,
    expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000)
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('2h')
    .sign(fp_encodedKey)

  return `${process.env.FRONTEND_URL}/sign-in/forgot-password/reset?token=${token}`
}

export async function verifyToken(token: string, action: Token['action']) {
  const encodedKey = action === 'reset_password' ? fp_encodedKey : ve_encodedKey

  try {
    const { payload } = await jwtVerify(token, encodedKey, {
      algorithms: ['HS256']
    })
    return payload as { userId: number }
  } catch (error) {
    if (error instanceof Error) {
      console.log('Failed to verify token')
    }
  }
}
