'use client'

import { useActionState } from 'react'
import Form from 'next/form'
import { createCustomTracking } from '@/lib/actions/custom-tracking'
import { SubmitButton } from '@/components/site/user/form'

export default function CreateGoalForm() {
  const [state, formAction] = useActionState(createCustomTracking, null)

  return (
    <Form action={formAction}>
      <div>
        <label htmlFor="name">Goal Name</label>
        <input
          type="text"
          id="name"
          name="name"
          required
          placeholder="Enter goal name"
        />
      </div>
      <SubmitButton>Create</SubmitButton>
      {state?.message && <p>{state.message}</p>}
    </Form>
  )
}
