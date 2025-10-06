import { use, useState } from 'react'
import { Loader2 } from 'lucide-react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  XAxis,
  YAxis
} from 'recharts'
import { getCustomTrackingMeta } from '@/lib/actions/get-custom-tracking-meta'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '../ui/chart'

export default function GoalChart({
  data
}: {
  data: ReturnType<typeof getCustomTrackingMeta>
}) {
  const metaData = use(data)
  const metaDataParsed = metaData.map((item) => ({
    name: new Date(item.date).toISOString().slice(0, 7),
    amount: Number(item.amount)
  }))

  const dateOptions: Intl.DateTimeFormatOptions = {
    month: 'short'
  }

  const [view, setView] = useState<'max' | '6m' | '12m'>('max')

  // Filter metaData based on view
  const filteredMetaData = (() => {
    if (view === 'max') {
      return metaDataParsed
    }

    if (metaDataParsed.length === 0) {
      return []
    }

    const sorted = [...metaDataParsed].sort((a, b) =>
      a.name.localeCompare(b.name)
    )

    if (view === '6m') {
      return sorted.slice(-6)
    }

    if (view === '12m') {
      return sorted.slice(-12)
    }

    return metaDataParsed
  })()

  const formattedData = filteredMetaData.map((item) => ({
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
    <>
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
            <CartesianGrid vertical={false} stroke="var(--slate-400)" />
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
            <YAxis
              width={30}
              type="number"
              domain={[5000, 31000]}
              interval={0}
              ticks={[5000, 10000, 15000, 20000, 25000, 30000]}
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
                  formatter={(value, name) => {
                    if (name === 'amount') {
                      return (
                        <span className="text-foreground font-mono font-medium tabular-nums">
                          £{value.toLocaleString()}
                        </span>
                      )
                    }
                    return value
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
              strokeWidth={1}
              stroke="var(--color-amber-500)"
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
      <div className="flex items-center justify-end mt-2 gap-2">
        <button
          type="button"
          className={`px-2 py-1 rounded text-xs font-medium border transition-colors ${
            view === '6m'
              ? 'bg-primary text-black border-primary'
              : 'bg-muted text-muted-foreground border-muted-foreground'
          }`}
          onClick={() => setView('6m')}
        >
          6m
        </button>
        <button
          type="button"
          className={`px-2 py-1 rounded text-xs font-medium border transition-colors ${
            view === '12m'
              ? 'bg-primary text-black border-primary'
              : 'bg-muted text-muted-foreground border-muted-foreground'
          }`}
          onClick={() => setView('12m')}
        >
          12m
        </button>
        <button
          type="button"
          className={`px-2 py-1 rounded text-xs font-medium border transition-colors ${
            view === 'max'
              ? 'bg-primary text-black border-primary'
              : 'bg-muted text-muted-foreground border-muted-foreground'
          }`}
          onClick={() => setView('max')}
        >
          Max
        </button>
      </div>
    </>
  )
}
