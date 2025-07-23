'use client'

import { useActionState } from 'react'
import { useMediaQuery } from '@/hooks/use-media-query'
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
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer'
import { Input } from '@/components/ui/input'

export default function AddEntryForm({ goal }: { goal: CustomTracking }) {
  const addEntryWithId = addEntry.bind(null, { trackId: goal.id })
  const [state, formAction] = useActionState(addEntryWithId, null)
  const isMobile = useMediaQuery('(max-width: 640px)')

  const formContent = (
    <form action={formAction} className="space-y-4 p-4">
      <div className="space-y-4">
        <div>
          <label htmlFor="date" className="block text-sm font-medium mb-1">
            Date
          </label>
          <Input type="date" id="date" name="date" required />
        </div>
        <div>
          <label htmlFor="amount" className="block text-sm font-medium mb-1">
            Amount
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none font-mono">
              £
            </span>
            <Input
              type="number"
              name="amount"
              inputMode="decimal"
              step="any"
              className="pl-7 font-mono"
            />
          </div>
        </div>
      </div>
      <SubmitButton className="w-full">Add</SubmitButton>
      {state?.message && (
        <p className="text-sm mt-2 text-red-600">{state.message}</p>
      )}
    </form>
  )

  const triggerButton = <Button type="button">Add Entry</Button>
  const title = 'Add Entry'

  return isMobile ? (
    <Drawer>
      <div className="flex justify-center mb-6">
        <DrawerTrigger asChild>{triggerButton}</DrawerTrigger>
      </div>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
        </DrawerHeader>
        {formContent}
      </DrawerContent>
    </Drawer>
  ) : (
    <Dialog>
      <div className="flex justify-center mb-6">
        <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      </div>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">{title}</DialogTitle>
        </DialogHeader>
        {formContent}
      </DialogContent>
    </Dialog>
  )
}
