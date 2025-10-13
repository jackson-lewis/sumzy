import { useActionState, useEffect } from 'react'
import type { FrequencyType } from '@prisma/client'
import { createSubscription } from '@/lib/actions/subscription'
import { Button } from '@/components/ui/button'

export default function CreateSubscriptionForm({
  originTransactionId,
  onCreated
}: {
  originTransactionId: number
  onCreated?: () => void
}) {
  // Only one frequency for now
  const frequency: FrequencyType = 'DATE_OF_MONTH'

  // Server action state
  const [state, formAction, pending] = useActionState(
    async (_prevState: unknown, formData: FormData) => {
      // Compose payload for server action
      const originTransactionId = Number(formData.get('originTransactionId'))
      const frequency = formData.get('frequency') as FrequencyType
      try {
        const result = await createSubscription({
          originTransactionId,
          frequency
        })
        return { success: true, data: result }
      } catch (error) {
        return {
          success: false,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to create subscription'
        }
      }
    },
    null
  )

  useEffect(() => {
    if (state?.success && onCreated) {
      onCreated()
    }
  }, [state, onCreated])

  return (
    <form action={formAction} className="flex flex-col gap-4 p-4">
      <input
        type="hidden"
        name="originTransactionId"
        value={originTransactionId}
      />
      <input type="hidden" name="frequency" value={frequency} />
      <div>
        <label className="block text-xs mb-1">Frequency</label>
        <select
          disabled
          value={frequency}
          className="w-full border rounded px-2 py-1 bg-muted-foreground/10"
        >
          <option value={frequency}>Date of Month</option>
        </select>
      </div>
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? 'Creating...' : 'Create Subscription'}
      </Button>
      {state?.error && (
        <div className="text-red-600 text-sm mt-2">{state.error}</div>
      )}
    </form>
  )
}
