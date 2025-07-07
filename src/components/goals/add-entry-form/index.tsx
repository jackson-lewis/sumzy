'use client'

import { useActionState } from 'react'
import Form from 'next/form'
import { CustomTracking } from '@prisma/client'
import { addEntry } from '@/lib/actions/custom-tracking'
import { SubmitButton } from '@/components/site/user/form'

export default function AddEntryForm({ goal }: { goal: CustomTracking }) {
  const addEntryWithId = addEntry.bind(null, { trackId: goal.id })
  const [state, formAction] = useActionState(addEntryWithId, null)

  return (
    <Form action={formAction} style={{ marginBottom: '2rem' }}>
      <div>
        <label htmlFor="name">Date</label>
        <input type="date" id="date" name="date" required />
        <label htmlFor="amount">Amount</label>
        <input type="number" name="amount" />
      </div>
      <SubmitButton>Add</SubmitButton>
      {state?.message && <p>{state.message}</p>}
    </Form>
  )
}
