'use client'

import { useActionState } from 'react'
import { createNetWorthAccount } from '@/lib/actions/net-worth'
import { Input } from '@/components/ui/input'
import { ResponsiveDialog } from '@/components/ui/responsive-dialog'
import { SubmitButton } from '../site/user/form'

export default function AddAccountForm() {
  const [state, formAction] = useActionState(createNetWorthAccount, null)

  return (
    <ResponsiveDialog title="Add Account" formSubmitted={!!state?.success}>
      <form action={formAction} className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-muted-foreground"
          >
            Account Name
          </label>
          <Input id="name" name="name" required autoFocus />
        </div>
        <SubmitButton type="submit" className="w-full">
          Add Account
        </SubmitButton>
        {state?.success && (
          <p className="text-green-600 text-sm mt-2">Account created!</p>
        )}
        {state?.error && (
          <p className="text-red-600 text-sm mt-2">{state.error}</p>
        )}
      </form>
    </ResponsiveDialog>
  )
}
