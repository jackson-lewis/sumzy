'use client'

import { useActionState, useEffect } from 'react'
import { toast } from 'sonner'
import { createCustomTracking } from '@/lib/actions/custom-tracking'
import { SubmitButton } from '@/components/site/user/form'
import { Input } from '@/components/ui/input'
import { ResponsiveDialog } from '@/components/ui/responsive-dialog'

export default function CreateGoalForm() {
  const [state, formAction] = useActionState(createCustomTracking, null)
  const title = 'Create Goal'

  useEffect(() => {
    if (state) {
      if (state.success) {
        toast.success(state.message)
      } else {
        toast.error(state.message)
      }
    }
  }, [state])

  return (
    <ResponsiveDialog title={title} formSubmitted={!!state?.success}>
      <form action={formAction} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Goal Name
          </label>
          <Input
            type="text"
            id="name"
            name="name"
            required
            placeholder="e.g. Buy a house, Save £10,000, Run a marathon"
          />
        </div>
        <SubmitButton>Create</SubmitButton>
      </form>
    </ResponsiveDialog>
  )
}
