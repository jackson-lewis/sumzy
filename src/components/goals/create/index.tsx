'use client'

import { useActionState } from 'react'
import { createCustomTracking } from '@/lib/actions/custom-tracking'
import { SubmitButton } from '@/components/site/user/form'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

export default function CreateGoalForm() {
  const [state, formAction] = useActionState(createCustomTracking, null)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button">Create</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Goal</DialogTitle>
        </DialogHeader>
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
          {state?.message && <p className="text-sm mt-2">{state.message}</p>}
        </form>
      </DialogContent>
    </Dialog>
  )
}
