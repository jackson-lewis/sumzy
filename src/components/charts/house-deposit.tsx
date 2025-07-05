'use client'

import { startTransition, useEffect, useState } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import { getCustomTrackingMeta } from '@/lib/actions/get-custom-tracking-meta'

export default function HouseDepositChart() {
  const dateOptions: Intl.DateTimeFormatOptions = {
    month: 'short'
  }

  const numberOptions: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0
  }

  // Add state for fetched data
  const [metaData, setMetaData] = useState<{ name: string; amount: number }[]>(
    []
  )

  useEffect(() => {
    startTransition(async () => {
      const data = await getCustomTrackingMeta(2)
      setMetaData(
        data.map((item) => ({
          name: new Date(item.date).toISOString().slice(0, 7),
          amount: Number(item.amount)
        }))
      )
    })
  }, [])

  // Use metaData instead of rawData
  const formattedData = metaData.map((item) => ({
    name: new Date(item.name + '-01').toLocaleDateString('en-GB', dateOptions),
    rawName: item.name,
    amount: item.amount
  }))

  const currencyFormatter = (value: number) => {
    if (value === 0) {
      return '0'
    }

    return (
      new Intl.NumberFormat('en-GB', numberOptions).format(value / 1000) + 'K'
    )
  }

  const currencyTooltipFormatter = (value: number) =>
    new Intl.NumberFormat('en-GB', numberOptions).format(value)

  // Custom tooltip to show month and year as label
  // const tooltipLabelFormatter = (label: string) => {
  // label is already formatted as e.g. "Jun" or "Jul" from formattedData
  // But we want e.g. "June 2024"
  // So let's parse the original date string from rawData
  // We'll map formattedData to include the original name as 'rawName'
  // and use that for formatting
  // return label // fallback if not found
  // }

  return (
    <ResponsiveContainer width="100%" height={600} aspect={2}>
      <LineChart
        width={1300}
        height={600}
        data={formattedData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5
        }}
      >
        <XAxis dataKey="name" />
        <YAxis tickFormatter={currencyFormatter} />
        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
        <Tooltip
          formatter={currencyTooltipFormatter}
          labelFormatter={(label, payload) => {
            const rawName = payload[0]?.payload.rawName
            if (rawName) {
              const date = new Date(rawName + '-01')
              return date.toLocaleDateString('en-GB', {
                month: 'long',
                year: 'numeric'
              })
            }
            return label
          }}
          labelStyle={{
            color: '#000'
          }}
          wrapperStyle={{
            borderRadius: '4px',
            overflow: 'hidden'
          }}
        />
        <ReferenceLine
          y={30000}
          yAxisId={0}
          label="Target"
          stroke="red"
          ifOverflow="extendDomain"
        />
        <Line type="monotone" dataKey="amount" stroke="#42eeba" />
      </LineChart>
    </ResponsiveContainer>
  )
}
