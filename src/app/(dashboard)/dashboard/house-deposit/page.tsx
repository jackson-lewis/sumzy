'use client'

import dynamic from 'next/dynamic'

const HouseDepositChart = dynamic(
  () => import('@/components/charts/house-deposit'),
  { ssr: false }
)

export default function HouseDeposit() {
  return (
    <div>
      <h1>House deposit</h1>
      <HouseDepositChart />
    </div>
  )
}
