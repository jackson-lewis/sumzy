'use client'

import Money from '@/components/global/money'
import {
  ComparePeriod,
  CompareTotal,
  Report as FakeReport
} from '@/types'
import styles from './style.module.scss'
import ExpenseCategories from './expense-categories'
import { useState } from 'react'
import CompareSelector from './compare-selector'
import { useReports } from '@/lib/swr'
import { useActiveMonth, useActiveYear } from '@/lib/form-submit'


function Total({
  title,
  total,
  compareTotal
} : {
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
      <dd className={styles.total}>
        <Money amount={total} />
      </dd>
      {compareTotal !== undefined ? (
        <dd
          className={[
            styles.compare,
            styles[direction]
          ].join(' ')}
        >
          <Money amount={compareTotal.amount} />
          <span>{`${compareTotal.percentage}%`}</span>
        </dd>
      ) : <dd className={styles.compare} />}
    </>
  )
}

function LastUpdatedDate({ date } : { date: Date }) {
  const dateTime = date.toLocaleDateString('en-GB', {
    'dateStyle': 'medium'
  })

  const displayTime = date.toLocaleDateString('en-GB')

  return (
    <p>
      Last updated:
      {' '}
      <time dateTime={dateTime}>{displayTime}</time>
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
  const [comparePeriod, setComparePeriod] = 
    useState<ComparePeriod>('prevMonth')

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
      <ExpenseCategories
        categoryTotals={report.tCategories}
      />
      {report.compare && (
        <>
          <dl className={styles.totals}>
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