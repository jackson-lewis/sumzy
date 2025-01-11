import { type User } from '@prisma/client'

export type UnverifiedUser = {
  emailVerifyLink: string
} & User

export type ForgotPasswordUser = {
  resetPasswordLink: string
} & User

export type SignUpFormData = {
  name: string
  email: string
  password: string
  password_confirm: string
}

export type SignUpActionResponse = {
  success: boolean
  message: string
  inputs?: SignUpFormData
  errors?: {
    [key in keyof Omit<
      SignUpFormData, 'password_confirm'
    >]?: string[] | undefined
  }
}

export type SignUpDataKeys = keyof SignUpFormData

export type PasswordValidationTypes = 
  'length' | 'uppercase' | 'number' | 'special'