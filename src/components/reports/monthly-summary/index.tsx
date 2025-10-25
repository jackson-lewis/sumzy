'use client'

import { useEffect, useState } from 'react'
import { CompareTotal } from '@/types'
import { Transaction } from '@prisma/client'
import useSWR from 'swr'
import { useActiveMonth, useActiveYear } from '@/lib/form-submit'
import { fetcher } from '@/lib/swr'
import Money from '@/components/global/money'
import MonthlySelector from '../monthly-selector'
import ExpenseCategories from './expense-categories'

function Total({
  title,
  total,
  compareTotal
}: {
  title: string
  total: number
  compareTotal?: CompareTotal | undefined
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

export default function MonthlySummaryReport() {
  const year = useActiveYear()
  const month = useActiveMonth()
  const { data: transactions } = useSWR<Transaction[]>(
    `/v1/transactions?from=${year}-${month}-01&to=${year}-${month}-31`,
    fetcher
  )

  const date = new Date(Number(year), Number(month) - 1)
  const monthYear = date.toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric'
  })

  const [report, setReport] = useState<{
    income: number
    expense: number
    surplus: number
    categories: Record<string, number>
  }>()

  useEffect(() => {
    if (transactions) {
      const newReport: typeof report = {
        income: 0,
        expense: 0,
        surplus: 0,
        categories: {}
      }

      transactions.forEach((transaction) => {
        const amount = Number(transaction.amount)
        const catKey = [
          transaction.categoryType,
          transaction.categoryType === 'DEFAULT'
            ? transaction.defaultCategoryId
            : transaction.categoryId
        ].join('-')

        if (catKey) {
          newReport.categories[catKey] =
            (newReport.categories[catKey] || 0) + amount
        }

        if (amount > 0) {
          newReport.income += amount
        } else {
          newReport.expense += amount
        }
      })

      newReport.surplus = newReport.income + newReport.expense

      setReport(newReport)
    }
  }, [transactions])

  if (!report) {
    return <div>Loading...</div>
  }

  return (
    <>
      <div className="flex items-center justify-between mt-6 mb-6">
        <h2 className="text-xl">{monthYear} Report</h2>
        <MonthlySelector />
      </div>
      <dl className="mb-8 p-2.5 grid grid-cols-3 gap-2.5 border border-[#ddd] rounded-lg text-center">
        <Total title="Income" total={report.income} />
        <Total title="Expense" total={report.expense} />
        <Total title="Surplus" total={report.surplus} />
      </dl>
      <ExpenseCategories categoryTotals={report.categories} />
    </>
  )
}
