'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { forgotPassword } from '@/lib/actions/user'
import {
  AltActionText,
  FormField,
  Message,
  SubmitButton,
  UserForm
} from '../form'

export default function ForgotPasswordForm() {
  const [message, formAction, pending] = useActionState(
    forgotPassword,
    undefined
  )

  return (
    <UserForm action={formAction}>
      <h1>Reset your password</h1>
      <p style={{ marginBottom: 20 }}>
        Type in your email and we&apos;ll send you a link to reset your password
      </p>
      <Message message={message} type="error" />
      <FormField
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        required
      />
      <SubmitButton disabled={pending}>Send Reset Email</SubmitButton>
      <AltActionText>
        Already have an account? <Link href="/sign-in">Sign in now</Link>
      </AltActionText>
    </UserForm>
  )
}
