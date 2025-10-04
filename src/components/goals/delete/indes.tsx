'use client'

import { useRouter } from 'next/navigation'
import { CustomTracking } from '@prisma/client'
import { toast } from 'sonner'
import { deleteGoal } from '@/lib/goals'
import { Button } from '@/components/ui/button'

export default function GoalDeleteButton({ goal }: { goal: CustomTracking }) {
  const router = useRouter()

  return (
    <Button
      variant="outline"
      className="m-auto"
      onClick={async () => {
        await deleteGoal(goal.id)
        router.push('/dashboard/goals')
        toast.success(`Goal ${goal.name} deleted.`)
      }}
    >
      Delete
    </Button>
  )
}
