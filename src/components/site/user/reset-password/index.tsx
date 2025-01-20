'use client'

import { useActionState, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { resetPassword } from '@/lib/actions/user'
import {
  AltActionText,
  Container,
  Message,
  NewPasswordField,
  SubmitButton,
  UserForm
} from '../form'

export default function ResetPasswordForm() {
  const [message, formAction, pending] = useActionState(
    resetPassword,
    undefined
  )
  const [disableSubmit, setDisableSubmit] = useState(true)
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  if (!token) {
    return (
      <Container>
        <h1>Reset your password</h1>
        <Message message={message} type="error" />
        <AltActionText>
          <Link href="/sign-in/forgot-password">Send new reset link</Link>
        </AltActionText>
      </Container>
    )
  }

  return (
    <UserForm action={formAction}>
      <h1>Reset your password</h1>
      <Message message={message} type="error" />
      <NewPasswordField setDisableSubmit={setDisableSubmit} />
      <input type="hidden" name="token" value={token} />
      <SubmitButton disabled={disableSubmit || pending}>
        Reset Password
      </SubmitButton>
      <AltActionText>
        Already have an account? <Link href="/sign-in">Sign in now</Link>
      </AltActionText>
    </UserForm>
  )
}
