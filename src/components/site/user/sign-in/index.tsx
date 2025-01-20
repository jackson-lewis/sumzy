'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { signIn } from '@/lib/actions/user'
import {
  AltActionText,
  FormField,
  Message,
  SubmitButton,
  UserForm
} from '../form'

export default function SignInForm() {
  const [message, formAction] = useActionState(signIn, undefined)
  const searchParams = useSearchParams()
  const action = searchParams.get('action') as
    | 'sign-out'
    | 'reset-password'
    | undefined
  const messages = {
    'sign-out': 'You have been signed out.',
    'reset-password':
      'Your password has been reset. Please sign in with your new password.'
  }

  return (
    <UserForm action={formAction}>
      <h1>Sign in</h1>
      <Message
        message={action && !message ? messages[action] : message}
        type={action && !message ? 'info' : 'error'}
      />
      <FormField
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        required
      />
      <FormField
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
      />
      <SubmitButton>Login</SubmitButton>
      <AltActionText>
        Don&apos;t have an account? <Link href="/sign-up">Sign up now</Link>
      </AltActionText>
    </UserForm>
  )
}
