'use client'

import { useActionState } from 'react'
import { CustomTracking } from '@prisma/client'
import { addEntry } from '@/lib/actions/custom-tracking'
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

export default function AddEntryForm({ goal }: { goal: CustomTracking }) {
  const addEntryWithId = addEntry.bind(null, { trackId: goal.id })
  const [state, formAction] = useActionState(addEntryWithId, null)

  return (
    <Dialog>
      <div className="flex justify-center mb-6">
        <DialogTrigger asChild>
          <Button type="button">Add Entry</Button>
        </DialogTrigger>
      </div>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Entry</DialogTitle>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label htmlFor="date" className="block text-sm font-medium mb-1">
                Date
              </label>
              <Input type="date" id="date" name="date" required />
            </div>
            <div className="flex-1">
              <label
                htmlFor="amount"
                className="block text-sm font-medium mb-1"
              >
                Amount
              </label>
              <Input type="number" name="amount" />
            </div>
          </div>
          <SubmitButton>Add</SubmitButton>
          {state?.message && (
            <p className="text-sm mt-2" style={{ color: 'red' }}>
              {state.message}
            </p>
          )}
        </form>
      </DialogContent>
    </Dialog>
  )
}
