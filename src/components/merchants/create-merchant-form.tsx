'use client'

import { useActionState, useEffect } from 'react'
import type { Merchant } from '@prisma/client'
import { logger } from '@sentry/nextjs'
import { createMerchant } from '@/lib/actions/merchant'
import { useMerchants } from '@/lib/swr'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ResponsiveDialog } from '@/components/ui/responsive-dialog'

type MerchantActionState = {
  success: boolean
  data?: Merchant
  error?: string
}

export default function CreateMerchantForm() {
  const [state, formAction, pending] = useActionState<
    MerchantActionState,
    FormData
  >(createMerchant, { success: false })
  const { data: merchants = [], mutate } = useMerchants()

  useEffect(() => {
    if (state.data) {
      logger.info('Mutating merchants after action state change.', {
        merchantId: state.data?.id
      })

      mutate([...merchants, { ...state.data, favorites: [] }])
    }
  }, [merchants, mutate, state])

  return (
    <ResponsiveDialog title="Add Merchant" formSubmitted={!!state?.success}>
      <form action={formAction} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Merchant Name
          </label>
          <Input type="text" name="name" id="name" required />
        </div>
        <Button type="submit" disabled={pending} className="w-full">
          {pending ? 'Adding...' : 'Add Merchant'}
        </Button>
        {state?.error && (
          <div className="text-red-600 text-sm mt-2">{state.error}</div>
        )}
      </form>
    </ResponsiveDialog>
  )
}
