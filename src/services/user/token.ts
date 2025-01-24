import { User } from '@prisma/client'
import { SignJWT, jwtVerify } from 'jose'

type Token = {
  userId: number
  action: 'reset_password' | 'verify_email'
}

export const fp_secretKey = process.env.FORGOT_PASSWORD_SECRET
export const fp_encodedKey = new TextEncoder().encode(fp_secretKey)
export const ve_secretKey = process.env.VERIFY_EMAIL_SECRET
export const ve_encodedKey = new TextEncoder().encode(ve_secretKey)

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
  const encodedKey = getEncodedKey(action)

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

function getEncodedKey(action: Token['action']) {
  if (action === 'reset_password') {
    return fp_encodedKey
  }

  return ve_encodedKey
}
