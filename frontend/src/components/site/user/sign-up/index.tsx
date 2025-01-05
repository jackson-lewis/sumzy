'use client'

import { useActionState, useState } from 'react'
import Link from 'next/link'
import {
  UserForm,
  AltActionText,
  Message, 
  FormField, 
  NewPasswordField, 
  SubmitButton 
} from '../form'
import { signUp } from '@/lib/actions/user'


export default function SignUpForm() {
  const [message, formAction, pending] = useActionState(signUp, null)
  const [disableSubmit, setDisableSubmit] = useState(true)

  return (
    <UserForm action={formAction}>
      <h1>Sign Up</h1>
      <Message message={message} type="error" />
      <FormField
        label="Name"
        name="name"
        type="text"
        autoComplete="name"
        required
      />
      <FormField
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        required
      />
      <NewPasswordField
        setDisableSubmit={setDisableSubmit}
      />
      <SubmitButton
        disabled={disableSubmit || pending}
      >
        Sign up
      </SubmitButton>
      <AltActionText>
        Have an account? <Link href="/sign-in">Sign in now</Link>
      </AltActionText>
    </UserForm>
  )
}
