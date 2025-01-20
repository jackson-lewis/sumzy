import { type NextRequest, NextResponse } from 'next/server'
import { sendUserVerifyEmail } from '@/services/notification/user'
import { generateEmailVerifyLink } from '@/services/user/token'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const existingUser = await prisma.user.findFirst({
    where: {
      email
    }
  })

  if (existingUser) {
    return NextResponse.json(
      {
        message: 'Email address already in use'
      },
      { status: 400 }
    )
  }

  // const hashedPassword = await bcrypt.hash(password, 10)
  const hashedPassword = password

  const user = await prisma.user.create({
    data: {
      name: formData.get('name') as string,
      email,
      password: hashedPassword
    }
  })

  const emailVerifyLink = await generateEmailVerifyLink(user)
  await sendUserVerifyEmail({ ...user, emailVerifyLink })

  return NextResponse.json(null, { status: 201 })
}

export async function GET(req: NextRequest) {
  const userId = req.headers.get('x-user-id')

  try {
    const user = await prisma.user.findFirst({
      where: {
        id: Number(userId)
      }
    })

    if (!user) {
      return NextResponse.json(
        {
          message: 'User not found'
        },
        { status: 404 }
      )
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userData } = user

    return NextResponse.json(userData, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 400 }
    )
  }
}

export async function PATCH(req: NextRequest) {
  const userId = req.headers.get('x-user-id')
  const formData = await req.formData()
  const user = await prisma.user.update({
    where: {
      id: Number(userId)
    },
    data: {
      name: formData.get('name') as string,
      email: formData.get('email') as string
    }
  })

  return NextResponse.json(user, { status: 200 })
}
