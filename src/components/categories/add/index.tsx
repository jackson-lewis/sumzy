'use client'

import { useActionState, useEffect } from 'react'
import { createCategory } from '@/lib/actions/category'
import { useCategories } from '@/lib/swr'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ResponsiveDialog } from '@/components/ui/responsive-dialog'

export default function AddCategory() {
  const [state, formAction, pending] = useActionState(createCategory, null)
  const { mutate } = useCategories()

  useEffect(() => {
    if (state) {
      if (state.success && state.data) {
        mutate((prev) => ({
          ...prev,
          defaultCategories: [...(prev?.defaultCategories || [])],
          userCategories: [...(prev?.userCategories || []), state.data]
        }))
      }
    }
  }, [state, mutate])

  const formContent = (
    <form action={formAction} className="space-y-4 p-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Name
        </label>
        <Input type="text" name="name" id="name" required />
      </div>
      <Button type="submit" disabled={pending} className="w-full">
        Add
      </Button>
    </form>
  )

  return (
    <ResponsiveDialog title="Add Category" formSubmitted={!!state && !pending}>
      {formContent}
    </ResponsiveDialog>
  )
}
