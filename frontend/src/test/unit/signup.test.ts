/** @jest-environment node */
import { signUp } from '@/lib/actions/user-sign-up'
import {
  SignUpActionResponse,
  SignUpDataKeys,
  SignUpFormData
} from '@/types/user'
import { prismaMock } from '../prisma-mock'

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
  email: 'jacksonlwss@gmail.com',
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


describe('Sign up action input validation', () => {
  it('should return error if passwords do not match', async () => {
    const formData = setupFormData({
      password_confirm: 'Password2!'
    })

    const res = await signUp(initialState, formData)

    expect(res.success).toBe(false)
    expect(res.message).toBe('Passwords do not match')
  })

  it('should return error with invalid email', async () => {
    const formData = setupFormData({
      email: 'jacksonlwss@gmail'
    })

    const res = await signUp(initialState, formData)

    expect(res.success).toBe(false)
    expect(res.message).toBe('Please fix the errors in the form')
    expect(res.errors?.email?.[0]).toBe('Invalid email address')
  })

  it('should return error with missing name', async () => {
    const formData = setupFormData({
      name: ''
    })

    const res = await signUp(initialState, formData)

    expect(res.success).toBe(false)
    expect(res.message).toBe('Please fix the errors in the form')
    expect(res.errors?.name?.[0]).toBe('Name is required')
  })

  it('should return error with missing email', async () => {
    const formData = setupFormData({
      email: ''
    })

    const res = await signUp(initialState, formData)

    expect(res.success).toBe(false)
    expect(res.message).toBe('Please fix the errors in the form')
    expect(res.errors?.email?.[0]).toBe('Invalid email address')
  })

  it('should return error if both passwords missing', async () => {
    const formData = setupFormData({
      password: '',
      password_confirm: ''
    })

    const res = await signUp(initialState, formData)

    expect(res.success).toBe(false)
    expect(res.message).toBe('Please fix the errors in the form')
    expect(res.errors?.password?.[0]).toBe('Password must be at least 8 characters')
  })
})


describe('Sign up action existing user validation', () => {
  it('should return error if email already in use', async () => {
    prismaMock.user.findFirst.mockResolvedValue({
      id: 1,
      name: 'Jackson Lewis',
      email: 'jacksonlwss@gmail.com',
      password: 'Password1!',
      verified: true
    })

    const formData = setupFormData()

    const res = await signUp(initialState, formData)

    expect(res.success).toBe(false)
    expect(res.message).toBe('Email address already in use')
  })
})


describe('Sign up action email verification', () => {
  it('should succeed', async () => {
    prismaMock.user.findFirst.mockResolvedValue(null)
    prismaMock.user.create.mockResolvedValue({
      id: 1,
      name: 'Jackson Lewis',
      email: 'jacksonlwss@gmail.com',
      password: 'Password1!',
      verified: true
    })
    const formData = setupFormData()

    const res = await signUp(initialState, formData)

    expect(res).toBeUndefined()
  })
})
