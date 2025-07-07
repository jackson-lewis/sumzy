import AddAccountForm from '@/components/net-worth/add-account-form'
import AddSnapshotForm from '@/components/net-worth/add-snapshot-form'
import NetWorthSnapshotTable from '@/components/net-worth/snapshot-table'

export default function NetWorth() {
  return (
    <div>
      <h1>Net Worth</h1>
      <AddAccountForm />
      <AddSnapshotForm />
      <NetWorthSnapshotTable />
      <p>
        This page will display your net worth over time, including assets and
        liabilities.
      </p>
    </div>
  )
}
