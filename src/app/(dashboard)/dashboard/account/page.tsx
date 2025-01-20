'use client'

import { signOut } from '@/lib/actions/user'
import AccountForm from '@/components/dashboard/account'
import { Button } from '@/components/shared/button'
import styles from './page.module.scss'

export default function Account() {
  return (
    <>
      <div className={styles.title}>
        <h1>Account</h1>
        <Button
          onClick={async () => {
            await signOut()
          }}
        >
          Logout
        </Button>
      </div>
      <AccountForm />
    </>
  )
}
