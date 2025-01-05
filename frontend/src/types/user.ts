import { type User } from '@prisma/client'

export type UnverifiedUser = {
  emailVerifyLink: string
} & User

export type ForgotPasswordUser = {
  resetPasswordLink: string
} & User