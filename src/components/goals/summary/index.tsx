'use client'

import { startTransition, useEffect, useState } from 'react'
import { CustomTracking } from '@prisma/client'
import { getCustomTrackingMeta } from '@/lib/actions/get-custom-tracking-meta'
import Money from '@/components/global/money'

export default function GoalSummary({ goal }: { goal: CustomTracking }) {
  const [metaData, setMetaData] = useState<{ name: string; amount: number }[]>(
    []
  )

  useEffect(() => {
    startTransition(async () => {
      const data = await getCustomTrackingMeta(goal.id)
      setMetaData(
        data.map((item) => ({
          name: new Date(item.date).toISOString().slice(0, 7),
          amount: Number(item.amount)
        }))
      )
    })
  }, [goal.id])

  const target = Number(goal.targetAmount) ?? 0
  const current = metaData.at(-1)?.amount ?? 0
  const left = Math.max(target - current, 0)

  return (
    <div className="flex flex-col items-center gap-2 my-6">
      <div>
        <span className="font-semibold text-muted-foreground">Target:</span>{' '}
        <Money amount={target} />
      </div>
      <div>
        <span className="font-semibold text-muted-foreground">Current:</span>{' '}
        <Money amount={current} />
      </div>
      <div>
        <span className="font-semibold text-muted-foreground">Remaining:</span>{' '}
        <Money amount={left} />
      </div>
    </div>
  )
}
