'use client'

import { signOut } from '@/lib/actions/user'
import AccountForm from '@/components/dashboard/account'
import { Button } from '@/components/ui/button'
import PageHeader from '@/components/ui/page-header'

export default function Account() {
  return (
    <>
      <PageHeader
        title="Account"
        backHref="/dashboard"
        action={
          <Button
            variant="secondary"
            onClick={async () => {
              await signOut()
            }}
          >
            Logout
          </Button>
        }
      />
      <AccountForm />
    </>
  )
}
