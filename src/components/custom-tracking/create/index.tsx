'use client'

import { useActionState } from 'react'
import Form from 'next/form'
import { createCustomTracking } from '@/lib/actions/custom-tracking'
import { SubmitButton } from '@/components/site/user/form'

export default function CreateCustomTrackingForm() {
  const [state, formAction] = useActionState(createCustomTracking, null)

  return (
    <Form action={formAction}>
      <div>
        <label htmlFor="name">Tracking Name</label>
        <input
          type="text"
          id="name"
          name="name"
          required
          placeholder="Enter tracking name"
        />
      </div>
      <SubmitButton>Create</SubmitButton>
      {state?.message && <p>{state.message}</p>}
    </Form>
  )
}
