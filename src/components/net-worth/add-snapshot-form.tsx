'use client'

import { useActionState } from 'react'
import { NetWorthAccount } from '@/types/net-worth'
import { createNetWorthSnapshot } from '@/lib/actions/net-worth'
import { useNetWorthAccounts } from '@/lib/swr/net-worth'

export default function AddSnapshotForm() {
  const [state, formAction] = useActionState(createNetWorthSnapshot, null)
  const { data: accounts = [] } = useNetWorthAccounts()

  return (
    <form action={formAction} style={{ marginBottom: '2rem' }}>
      <div>
        <label htmlFor="date">Date</label>
        <input id="date" name="date" type="date" required />
      </div>
      {accounts.length > 0 ? (
        <>
          <p>Enter the value for each account:</p>
          {accounts.map((account: NetWorthAccount) => (
            <div key={account.id}>
              <label htmlFor={`account-${account.id}`}>{account.name}</label>
              <input
                id={`account-${account.id}`}
                name={`account-${account.id}`}
                type="number"
                step="0.01"
                required
              />
            </div>
          ))}
        </>
      ) : (
        <p>No accounts found. Please add an account first.</p>
      )}
      <button type="submit" disabled={accounts.length === 0}>
        Add Snapshot
      </button>
      {state?.success && <p>Snapshot added!</p>}
      {state?.error && <p>{state.error}</p>}
    </form>
  )
}
