'use client'

import { useActionState } from 'react'
import { useMediaQuery } from '@/hooks/use-media-query'
import { Plus } from 'lucide-react'
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
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer'
import { Input } from '@/components/ui/input'

export default function CreateGoalForm() {
  const [state, formAction] = useActionState(createCustomTracking, null)
  const isDesktop = useMediaQuery('(min-width: 768px)')

  const form = (
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
  )

  const triggerButton = (
    <Button
      type="button"
      size="icon"
      aria-label="Create goal"
      className="bg-transparent hover:bg-muted shadow-none border-none"
    >
      <Plus className="text-primary" />
    </Button>
  )
  const title = 'Create Goal'

  if (isDesktop) {
    return (
      <Dialog>
        <DialogTrigger
          asChild
          className="absolute right-0 top-1/2 -translate-y-1/2"
        >
          {triggerButton}
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          {form}
        </DialogContent>
      </Dialog>
    )
  }
  return (
    <Drawer>
      <DrawerTrigger
        asChild
        className="absolute right-0 top-1/2 -translate-y-1/2"
      >
        {triggerButton}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
        </DrawerHeader>
        <div className="p-4 pt-0">{form}</div>
      </DrawerContent>
    </Drawer>
  )
}
