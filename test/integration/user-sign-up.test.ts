/** @jest-environment node */
import {
  SignUpActionResponse,
  SignUpDataKeys,
  SignUpFormData
} from '@/types/user'
import { signUp } from '@/lib/actions/user-sign-up'
import { prisma } from '@/lib/prisma'
import { seedUser, userData } from '../seeding'

jest.mock('next/navigation', () => {
  return {
    redirect: jest.fn()
  }
})

jest.mock('@/services/notification/user', () => {
  return {
    sendUserVerifyEmail: jest.fn(() => {
      return Promise.resolve()
    })
  }
})

const initialState: SignUpActionResponse = {
  success: false,
  message: ''
}

const userInput: SignUpFormData = {
  ...userData,
  password_confirm: userData.password
}

function setupFormData(data: Partial<SignUpFormData> = {}) {
  const formData = new FormData()

  const mergedData = { ...userInput, ...data }

  Object.keys(mergedData).forEach((key) => {
    formData.append(key, mergedData[key as SignUpDataKeys])
  })

  return formData
}

describe('Sign up process', () => {
  afterEach(async () => {
    const deleteUser = prisma.user.deleteMany()

    await prisma.$transaction([deleteUser])
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  it('should sign user up', async () => {
    const formData = setupFormData()

    const res = await signUp(initialState, formData)

    expect(res).toBeUndefined()
  })

  it('should fail signup with email already exists', async () => {
    await seedUser()

    const formData = setupFormData()
    const res = await signUp(initialState, formData)

    expect(res.success).toBe(false)
    expect(res.message).toBe('Email address already in use')
  })
})
