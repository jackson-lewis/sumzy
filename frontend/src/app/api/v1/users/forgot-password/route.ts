import { NextResponse, type NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateResetPasswordLink } from '@/services/user/token'
import { sendPasswordResetEmail } from '@/services/notification/user'

export async function POST(request: NextRequest) {
  const json: {
    email: string
  } = await request.json()
  
  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        email: json.email
      }
    })
    
    if (!existingUser) {
      return NextResponse.json({
        message: 'Email address not found'
      }, { status: 400 })
    }

    const resetPasswordLink = await generateResetPasswordLink(existingUser)
    await sendPasswordResetEmail({ ...existingUser, resetPasswordLink })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch(error) {
    return NextResponse.json({
      message: error instanceof Error ? error.message : 'Uknown error'
    }, { status: 400 })
  }
}