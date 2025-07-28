'use client'

import { Loader2 } from 'lucide-react'
import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts'
import { useNetWorthSnapshots } from '@/lib/swr/net-worth-snapshots'
import { ChartConfig, ChartContainer } from '../ui/chart'

export default function NetWorthTotalChart() {
  const { data = [], isLoading } = useNetWorthSnapshots()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="animate-spin mr-2" /> Loading...
      </div>
    )
  }

  if (!data.length) {
    return (
      <div className="text-muted-foreground text-center">
        No net worth data found.
      </div>
    )
  }

  // Prepare chart data: [{ date, total }]
  const chartData = data.map((snap) => {
    const total = (snap.balances || []).reduce(
      (sum, bal) => sum + Number(bal.balance),
      0
    )
    return {
      date: new Date(snap.snapshotDate).toLocaleDateString('en-GB', {
        month: 'short',
        year: 'numeric'
      }),
      total
    }
  })

  const chartConfig = {
    amount: {
      label: 'Amount',
      color: '#2563eb'
    }
  } satisfies ChartConfig

  return (
    <div className="w-full max-w-2xl mx-auto my-8">
      <ChartContainer
        config={chartConfig}
        className="min-h-[200px] max-h-[500px] w-full"
      >
        <LineChart
          data={chartData}
          margin={{ left: 12, right: 12, top: 12, bottom: 12 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--slate-400)" />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={32}
          />
          <YAxis
            width={30}
            type="number"
            interval={0}
            tickFormatter={(value) => `£${(value / 1000).toLocaleString()}k`}
            axisLine={false}
            tickLine={false}
            tick={({ x, y, payload }) => {
              const isTarget = payload.value === 30000
              return (
                <text
                  x={x}
                  y={y}
                  textAnchor="end"
                  fontFamily="monospace"
                  fontSize={12}
                  fill={
                    isTarget
                      ? 'var(--color-amber-500)'
                      : 'var(--muted-foreground)'
                  } // gold for target, slate-500 for others
                  dy={3}
                >
                  £{(payload.value / 1000).toLocaleString()}k
                </text>
              )
            }}
          />
          <Tooltip
            formatter={(value) => `£${Number(value).toLocaleString()}`}
          />
          <Line
            type="monotone"
            dataKey="total"
            stroke="var(--primary)"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ChartContainer>
    </div>
  )
}
