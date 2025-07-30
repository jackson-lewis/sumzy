'use client'

import { useActionState } from 'react'
import { CustomTracking } from '@prisma/client'
import { addEntry } from '@/lib/actions/custom-tracking'
import { SubmitButton } from '@/components/site/user/form'
import { CurrencyInput } from '@/components/ui/currency-input'
import { ResponsiveDialog } from '@/components/ui/responsive-dialog'
// Dialog and Drawer imports removed; now handled by ResponsiveDialog
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

  return (
    <ResponsiveDialog
      title="Add Entry"
      formSubmitted={!!state && !state?.message}
    >
      <form action={formAction} className="space-y-4">
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
    </ResponsiveDialog>
  )
}
