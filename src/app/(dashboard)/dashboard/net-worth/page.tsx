import Link from 'next/link'
import AddSnapshotForm from '@/components/net-worth/add-snapshot-form'
import NetWorthSnapshotTable from '@/components/net-worth/snapshot-table'
import NetWorthTotalChart from '@/components/net-worth/total-chart'
import { BackButton } from '@/components/ui/back-button'
import { Button } from '@/components/ui/button'
import { PageTitle } from '@/components/ui/page-title'

export default function NetWorth() {
  return (
    <div>
      <div className="relative flex items-center justify-center mb-4">
        <BackButton
          href="/dashboard"
          className="absolute left-0 top-1/2 -translate-y-1/2"
        />
        <PageTitle className="text-center w-full">Net Worth</PageTitle>

        <AddSnapshotForm />
      </div>
      <NetWorthTotalChart />
      <NetWorthSnapshotTable />
      <div className="mt-4 flex justify-center">
        <Link href="/dashboard/net-worth/accounts">
          <Button variant="outline">Manage Accounts</Button>
        </Link>
      </div>
    </div>
  )
}
