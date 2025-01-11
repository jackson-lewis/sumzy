import { prisma } from '@/lib/prisma'
import { sendPasswordResetSuccessEmail } from '@/services/notification/user'
import { verifyToken } from '@/services/user/token'
import bcrypt from 'bcrypt'
import { NextResponse, type NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const {
    token,
    password,
    password_confirm
  }: {
    [k: string]: string
  } = await request.json()

  try {
    const payload = await verifyToken(token, 'reset_password')

    if (!payload) {
      return NextResponse.json({
        message: 'Invalid token'
      }, { status: 400 })
    }

    const passwordMatch = password === password_confirm

    if (!passwordMatch) {
      return NextResponse.json({
        message: 'Passwords do not match'
      }, { status: 400 })
    }

    const hash = bcrypt.hashSync(password, 10)

    const user = await prisma.user.update({
      where: {
        id: payload.userId
      },
      data: {
        password: hash
      }
    })

    await sendPasswordResetSuccessEmail(user)

    return NextResponse.json({ success: true }, { status: 200 })
  } catch(error) {
    return NextResponse.json({
      message: error instanceof Error ? error.message : 'Uknown error'
    }, { status: 400 })
  }
}