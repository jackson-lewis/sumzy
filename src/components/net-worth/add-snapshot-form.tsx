'use client'

import { useEffect, useState } from 'react'
import { useActionState } from 'react'
import { useMediaQuery } from '@/hooks/use-media-query'
import { NetWorthAccount } from '@/types/net-worth'
import { Plus } from 'lucide-react'
import { createNetWorthSnapshot } from '@/lib/actions/net-worth'
import { useNetWorthAccounts } from '@/lib/swr/net-worth'
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

export default function AddSnapshotForm() {
  const [state, formAction] = useActionState(createNetWorthSnapshot, null)
  const { data: accounts = [] } = useNetWorthAccounts()
  const isMobile = useMediaQuery('(max-width: 640px)')
  const [open, setOpen] = useState(false)
  const title = 'Add Snapshot'

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
            <div key={account.id} className="space-y-2">
              <label
                htmlFor={`account-${account.id}`}
                className="block text-sm font-medium text-muted-foreground"
              >
                {account.name}
              </label>
              <Input
                id={`account-${account.id}`}
                name={`account-${account.id}`}
                type="number"
                step="0.01"
                required
                className="font-mono"
              />
            </div>
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
  )

  const triggerButton = (
    <Button
      type="button"
      size="icon"
      aria-label="Add snapshot"
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
