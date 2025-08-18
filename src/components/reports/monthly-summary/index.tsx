'use client'

import { useState } from 'react'
import { ComparePeriod, CompareTotal, Report as FakeReport } from '@/types'
import { useActiveMonth, useActiveYear } from '@/lib/form-submit'
import { useReports } from '@/lib/swr'
import Money from '@/components/global/money'
import CompareSelector from './compare-selector'
import ExpenseCategories from './expense-categories'

function Total({
  title,
  total,
  compareTotal
}: {
  title: string
  total: number
  compareTotal: CompareTotal | undefined
}) {
  let direction = 'neutral'

  if (compareTotal !== undefined) {
    if (title === 'Expense') {
      if (compareTotal.amount > 0) {
        direction = 'negative'
      } else if (compareTotal.amount < 0) {
        direction = 'positive'
      }
    } else {
      if (compareTotal.amount > 0) {
        direction = 'positive'
      } else if (compareTotal.amount < 0) {
        direction = 'negative'
      }
    }
  }

  return (
    <>
      <dt>{title}</dt>
      <dd className="font-semibold text-xl row-start-2">
        <Money amount={total} />
      </dd>
      {compareTotal !== undefined ? (
        <dd
          className={
            direction === 'positive'
              ? 'row-start-3 text-green-600'
              : direction === 'negative'
                ? 'row-start-3 text-red-600'
                : 'row-start-3'
          }
        >
          <Money amount={compareTotal.amount} />
          <span>{`${compareTotal.percentage}%`}</span>
        </dd>
      ) : (
        <dd className="row-start-3" />
      )}
    </>
  )
}

function LastUpdatedDate({ date }: { date: Date }) {
  const dateTime = date.toLocaleDateString('en-GB', {
    dateStyle: 'medium'
  })

  const displayTime = date.toLocaleDateString('en-GB')

  return (
    <p>
      Last updated: <time dateTime={dateTime}>{displayTime}</time>
    </p>
  )
}

export default function MonthlySummaryReport() {
  const { data: report } = useReports()
  const year = useActiveYear()
  const month = useActiveMonth()

  const date = new Date(Number(year), Number(month) - 1)
  const monthYear = date.toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric'
  })
  const [comparePeriod, setComparePeriod] = useState<ComparePeriod>('prevMonth')

  if (!report) {
    return (
      <>
        <h1>{monthYear} Report</h1>
        <p>Report could not be found.</p>
      </>
    )
  }

  const compare = report.compare as FakeReport['compare']

  return (
    <>
      <h1>{monthYear} Report</h1>
      <LastUpdatedDate date={new Date(report.lastUpdatedDate)} />
      <ExpenseCategories categoryTotals={report.tCategories} />
      {report.compare && (
        <>
          <dl className="mt-[50px] p-2.5 grid grid-cols-3 gap-2.5 border border-[#ddd] rounded-lg text-center">
            <Total
              title="Income"
              total={report.tIncome}
              compareTotal={compare[comparePeriod]?.income}
            />
            <Total
              title="Expense"
              total={report.tExpense}
              compareTotal={compare[comparePeriod]?.expense}
            />
            <Total
              title="Surplus"
              total={report.tSurplus}
              compareTotal={compare[comparePeriod]?.surplus}
            />
          </dl>
          <CompareSelector
            comparePeriod={comparePeriod}
            setComparePeriod={setComparePeriod}
            hasPrevMonthReport={!!compare.prevMonth}
            hasYearOverYearReport={!!compare.yearOverYear}
          />
        </>
      )}
    </>
  )
}
