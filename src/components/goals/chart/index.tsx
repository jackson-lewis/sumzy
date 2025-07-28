'use client'

import dynamic from 'next/dynamic'

const GoalChart = dynamic(() => import('@/components/charts/goal'), {
  ssr: false
})

export default function ChartWrapper({ id }: { id: number }) {
  return <GoalChart id={id} />
}
