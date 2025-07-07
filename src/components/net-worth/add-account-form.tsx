'use client'

import { useActionState } from 'react'
import { createNetWorthAccount } from '@/lib/actions/net-worth'

export default function AddAccountForm() {
  const [state, formAction] = useActionState(createNetWorthAccount, null)

  return (
    <form action={formAction} style={{ marginBottom: '2rem' }}>
      <div>
        <label htmlFor="name">Account Name</label>
        <input id="name" name="name" required />
      </div>
      <button type="submit">Add Account</button>
      {state?.success && <p>Account created!</p>}
      {state?.error && <p>{state.error}</p>}
    </form>
  )
}
