'use client'

import dynamic from 'next/dynamic'
import { getCustomTrackingMeta } from '@/lib/actions/get-custom-tracking-meta'

const GoalChart = dynamic(() => import('@/components/charts/goal'), {
  ssr: false
})

export default function ChartWrapper({
  data
}: {
  data: ReturnType<typeof getCustomTrackingMeta>
}) {
  return <GoalChart data={data} />
}
