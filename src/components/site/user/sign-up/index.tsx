'use client'

import { useActionState, useState } from 'react'
import Link from 'next/link'
import { SignUpActionResponse } from '@/types/user'
import { signUp } from '@/lib/actions/user-sign-up'
import {
  AltActionText,
  FormField,
  Message,
  NewPasswordField,
  SubmitButton,
  UserForm
} from '../form'

const initialState: SignUpActionResponse = {
  success: false,
  message: ''
}

export default function SignUpForm() {
  const [state, formAction, pending] = useActionState(signUp, initialState)
  const [disableSubmit, setDisableSubmit] = useState(true)

  return (
    <UserForm action={formAction}>
      <h1>Sign Up</h1>
      <Message
        message={state?.message}
        type={state.success ? 'info' : 'error'}
      />
      <FormField
        label="Name"
        name="name"
        type="text"
        autoComplete="name"
        defaultValue={state.inputs?.name}
        error={state.errors?.name}
      />
      <FormField
        label="Email"
        name="email"
        type="email"
        required
        autoComplete="email"
        defaultValue={state.inputs?.email}
        error={state.errors?.email}
      />
      <NewPasswordField
        setDisableSubmit={setDisableSubmit}
        error={state.errors?.password}
      />
      <SubmitButton disabled={disableSubmit || pending}>Sign up</SubmitButton>
      <AltActionText>
        Have an account? <Link href="/sign-in">Sign in now</Link>
      </AltActionText>
    </UserForm>
  )
}
