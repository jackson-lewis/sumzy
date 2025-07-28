'use client'

import { signOut } from '@/lib/actions/user'
import AccountForm from '@/components/dashboard/account'
import { BackButton } from '@/components/ui/back-button'
import { Button } from '@/components/ui/button'
import { PageTitle } from '@/components/ui/page-title'

export default function Account() {
  return (
    <>
      <div className="relative min-h-12">
        <div className="absolute left-0 top-1/2 -translate-y-1/2">
          <BackButton href="/dashboard" />
        </div>
        <div className="flex justify-center items-center h-12">
          <PageTitle>Account</PageTitle>
        </div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2">
          <Button
            variant="secondary"
            onClick={async () => {
              await signOut()
            }}
          >
            Logout
          </Button>
        </div>
      </div>
      <AccountForm />
    </>
  )
}
