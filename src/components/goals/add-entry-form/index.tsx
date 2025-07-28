'use client'

import { useActionState } from 'react'
import { useEffect, useState } from 'react'
import { useMediaQuery } from '@/hooks/use-media-query'
import { CustomTracking } from '@prisma/client'
import { Plus } from 'lucide-react'
import { addEntry } from '@/lib/actions/custom-tracking'
import { SubmitButton } from '@/components/site/user/form'
import { Button } from '@/components/ui/button'
import { CurrencyInput } from '@/components/ui/currency-input'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

export default function AddEntryForm({ goal }: { goal: CustomTracking }) {
  const addEntryWithId = addEntry.bind(null, { trackId: goal.id })
  const [state, formAction] = useActionState(addEntryWithId, null)
  const isMobile = useMediaQuery('(max-width: 640px)')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (state && !state?.message) {
      setOpen(false)
    }
  }, [state])

  const getMonthOptions = () => {
    const options = []
    const now = new Date()
    for (let i = -6; i <= 6; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() + i, 2)
      const value = date.toISOString().slice(0, 10)
      const label = date.toLocaleString('en-GB', {
        month: 'long',
        year: 'numeric'
      })
      options.push({ value, label })
    }
    return options
  }
  const monthOptions = getMonthOptions()
  const currentMonthValue = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    2
  )
    .toISOString()
    .slice(0, 10)

  const formContent = (
    <form action={formAction} className="space-y-4 p-4">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Month</label>
          <Select name="date" defaultValue={currentMonthValue} required>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              {monthOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <CurrencyInput name="amount" />
      </div>
      <SubmitButton className="w-full">Add</SubmitButton>
      {state?.message && (
        <p className="text-sm mt-2 text-red-600">{state.message}</p>
      )}
    </form>
  )

  const triggerButton = (
    <Button
      type="button"
      size="icon"
      aria-label="Add Entry"
      className="bg-transparent hover:bg-muted shadow-none border-none"
    >
      <Plus className="text-primary" />
    </Button>
  )
  const title = 'Add Entry'

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
