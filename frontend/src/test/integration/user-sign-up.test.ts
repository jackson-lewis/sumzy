/** @jest-environment node */
import { signUp } from '@/lib/actions/user-sign-up'
import { prisma } from '@/lib/prisma'
import {
  SignUpActionResponse,
  SignUpDataKeys,
  SignUpFormData
} from '@/types/user'

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
  name: 'Jackson Lewis',
  email: 'jacksonlwss30@gmail.com',
  password: 'Password1!',
  password_confirm: 'Password1!'
}

function setupFormData(data: Partial<SignUpFormData> = {}) {
  const formData = new FormData()

  const mergedData = {...userInput, ...data}

  Object.keys(mergedData)
    .forEach((key) => {
      formData.append(key, mergedData[key as SignUpDataKeys])
    })

  return formData
}

describe('Sign up process', () => {
  afterAll(async () => {
    const deleteUser = prisma.user.deleteMany()
  
    await prisma.$transaction([
      deleteUser
    ])
  
    await prisma.$disconnect()
  })
  
  it('should sign user up', async () => {
    const formData = setupFormData()

    const res = await signUp(initialState, formData)

    expect(res).toBeUndefined()
  })
})
