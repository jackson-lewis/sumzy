import { startTransition, useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { CartesianGrid, Line, LineChart, ReferenceLine, XAxis } from 'recharts'
import { getCustomTrackingMeta } from '@/lib/actions/get-custom-tracking-meta'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '../ui/chart'

export default function GoalChart({ id }: { id: number }) {
  const dateOptions: Intl.DateTimeFormatOptions = {
    month: 'short'
  }

  const [metaData, setMetaData] = useState<{ name: string; amount: number }[]>(
    []
  )

  useEffect(() => {
    startTransition(async () => {
      const data = await getCustomTrackingMeta(id)
      setMetaData(
        data.map((item) => ({
          name: new Date(item.date).toISOString().slice(0, 7),
          amount: Number(item.amount)
        }))
      )
    })
  }, [])

  const formattedData = metaData.map((item) => ({
    date: item.name + '-01',
    rawName: item.name,
    amount: item.amount
  }))

  const chartConfig = {
    amount: {
      label: 'Amount',
      color: '#2563eb'
    }
  } satisfies ChartConfig

  return (
    <ChartContainer
      config={chartConfig}
      className="min-h-[200px] max-h-[500px] w-full"
    >
      {metaData.length > 0 ? (
        <LineChart
          accessibilityLayer
          data={formattedData}
          margin={{
            left: 12,
            right: 12
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={32}
            tickFormatter={(value) => {
              const date = new Date(value)
              return date.toLocaleDateString('en-GB', dateOptions)
            }}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                className="w-[150px]"
                nameKey="views"
                labelFormatter={(value) => {
                  return new Date(value).toLocaleDateString('en-GB', {
                    month: 'short',
                    year: 'numeric'
                  })
                }}
              />
            }
          />
          <Line
            dataKey="amount"
            type="monotone"
            stroke="var(--primary)"
            strokeWidth={2}
            dot={false}
          />
          <ReferenceLine
            y={30000}
            yAxisId={0}
            strokeWidth={2}
            stroke="var(--color-red-500)"
            ifOverflow="extendDomain"
          />
        </LineChart>
      ) : (
        <div className="flex min-h-[200px] items-center justify-center w-full">
          <Loader2 className="mr-2 h-5 w-5 animate-spin text-muted-foreground" />
          <span className="text-muted-foreground">Fetching your data...</span>
        </div>
      )}
    </ChartContainer>
  )
}
