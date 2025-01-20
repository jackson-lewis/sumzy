import { type NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/services/user/token'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  const {
    token
  }: {
    token: string
  } = await request.json()

  try {
    const payload = await verifyToken(token, 'verify_email')

    if (!payload) {
      return NextResponse.json(
        {
          message: 'Invalid token'
        },
        { status: 400 }
      )
    }

    const user = await prisma.user.update({
      where: {
        id: payload.userId
      },
      data: {
        verified: true
      }
    })

    return NextResponse.json(user, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : 'Invalid token'
      },
      { status: 400 }
    )
  }
}
