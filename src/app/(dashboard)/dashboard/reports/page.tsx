import { Suspense } from 'react'
import MonthlySummaryReport from '@/components/reports/monthly-summary'
import PageHeader from '@/components/ui/page-header'

export default function Reports() {
  return (
    <main>
      <PageHeader title="Monthly Summary" backHref="/dashboard" />
      <Suspense fallback={<p>Loading report...</p>}>
        <MonthlySummaryReport />
      </Suspense>
    </main>
  )
}
