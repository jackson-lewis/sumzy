'use client'

import { useActionState } from 'react'
import { NetWorthAccount } from '@/types/net-worth'
import { createNetWorthSnapshot } from '@/lib/actions/net-worth'
import { useNetWorthAccounts } from '@/lib/swr/net-worth'
import { Input } from '@/components/ui/input'
import { ResponsiveDialog } from '@/components/ui/responsive-dialog'
import { SubmitButton } from '../site/user/form'
import { CurrencyInput } from '../ui/currency-input'

export default function AddSnapshotForm() {
  const [state, formAction] = useActionState(createNetWorthSnapshot, null)
  const { data: accounts = [] } = useNetWorthAccounts()

  return (
    <ResponsiveDialog title="Add Snapshot" formSubmitted={!!state?.success}>
      <form action={formAction} className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="date"
            className="block text-sm font-medium text-muted-foreground"
          >
            Date
          </label>
          <Input id="date" name="date" type="date" required />
        </div>
        {accounts.length > 0 ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Enter the value for each account:
            </p>
            {accounts.map((account: NetWorthAccount) => (
              <CurrencyInput
                key={account.id}
                name={`account-${account.id}`}
                label={account.name}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No accounts found. Please add an account first.
          </p>
        )}
        <SubmitButton
          type="submit"
          className="w-full"
          disabled={accounts.length === 0}
        >
          Add Snapshot
        </SubmitButton>
        {state?.success && (
          <p className="text-green-600 text-sm mt-2">Snapshot added!</p>
        )}
        {state?.error && (
          <p className="text-red-600 text-sm mt-2">{state.error}</p>
        )}
      </form>
    </ResponsiveDialog>
  )
}
