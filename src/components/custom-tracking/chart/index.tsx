'use client'

import dynamic from 'next/dynamic'

const HouseDepositChart = dynamic(
  () => import('@/components/charts/house-deposit'),
  { ssr: false }
)

export default function ChartWrapper({ id }: { id: number }) {
  return <HouseDepositChart id={id} />
}
