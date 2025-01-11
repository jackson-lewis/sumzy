import MonthlySelector from '@/components/reports/monthly-selector'
import MonthlySummaryReport from '@/components/reports/monthly-summary'
import { Suspense } from 'react'

export default function Reports() {
  return (
    <main>
      <Suspense fallback={<p>Loading report...</p>}>
        <MonthlySelector />
        <MonthlySummaryReport />
      </Suspense>
    </main>
  )
}