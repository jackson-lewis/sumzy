'use client'

import { useEffect, useState } from 'react'
import { useActionState } from 'react'
import { useMediaQuery } from '@/hooks/use-media-query'
import { Plus } from 'lucide-react'
import { createNetWorthAccount } from '@/lib/actions/net-worth'
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
import { SubmitButton } from '../site/user/form'

export default function AddAccountForm() {
  const [state, formAction] = useActionState(createNetWorthAccount, null)
  const isMobile = useMediaQuery('(max-width: 640px)')
  const [open, setOpen] = useState(false)
  const title = 'Add Account'

  // Close drawer/dialog on success
  useEffect(() => {
    if (state?.success) {
      setOpen(false)
    }
  }, [state])

  const formContent = (
    <form action={formAction} className="space-y-4 p-4">
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
  )

  const triggerButton = (
    <Button
      type="button"
      size="icon"
      aria-label="Add account"
      className="bg-transparent hover:bg-muted shadow-none border-none"
    >
      <Plus className="text-primary" />
    </Button>
  )

  return isMobile ? (
    <Drawer open={open} onOpenChange={setOpen}>
      <div className="absolute right-0 top-1/2 -translate-y-1/2">
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
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="absolute right-0 top-1/2 -translate-y-1/2">
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
