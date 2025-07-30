import Link from 'next/link'
import AddSnapshotForm from '@/components/net-worth/add-snapshot-form'
import NetWorthSnapshotTable from '@/components/net-worth/snapshot-table'
import NetWorthTotalChart from '@/components/net-worth/total-chart'
import { Button } from '@/components/ui/button'
import PageHeader from '@/components/ui/page-header'

export default function NetWorth() {
  return (
    <div>
      <PageHeader
        title="Net Worth"
        backHref="/dashboard"
        action={<AddSnapshotForm />}
      />
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
