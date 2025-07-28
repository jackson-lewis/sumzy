import AddAccountForm from '@/components/net-worth/add-account-form'
import { BackButton } from '@/components/ui/back-button'
import { PageTitle } from '@/components/ui/page-title'

export default function NetWorthAccountsPage() {
  return (
    <div>
      <div className="relative flex items-center justify-center mb-4">
        <BackButton
          href="/dashboard/net-worth"
          className="absolute left-0 top-1/2 -translate-y-1/2"
        />
        <PageTitle className="text-center w-full">Accounts</PageTitle>
        <AddAccountForm />
      </div>
    </div>
  )
}
