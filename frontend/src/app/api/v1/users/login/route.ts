import { prisma } from '@/lib/prisma'
import { generateSignInToken } from '@/services/user/token'
import { NextResponse, type NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const user = await prisma.user.findFirst({
    where: {
      email
    }
  })
  
  if (!user || password !== user.password) {
   return NextResponse.json({
      error: 'Email address or password invalid'
    }, { status: 400 })
  }

  if (!user.verified) {
    return NextResponse.json({
      error: 'Email address not verified'
    }, { status: 400 })
  }

  const token = generateSignInToken(user.id)

  return NextResponse.json({ token })
}