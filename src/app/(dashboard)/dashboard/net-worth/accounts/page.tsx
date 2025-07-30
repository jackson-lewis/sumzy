import AddAccountForm from '@/components/net-worth/add-account-form'
import PageHeader from '@/components/ui/page-header'

export default function NetWorthAccountsPage() {
  return (
    <PageHeader
      title="Accounts"
      backHref="/dashboard/net-worth"
      action={<AddAccountForm />}
    />
  )
}
