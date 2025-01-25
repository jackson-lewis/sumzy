import { Suspense } from 'react'
import { SWRConfig } from 'swr'
import TransactionsProvider from '@/lib/transactions-context'
import MobileNavBar from '@/components/layout/mobile-nav-bar'
import styles from './layout.module.scss'

export default function DashboardLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <SWRConfig>
      <Suspense>
        <TransactionsProvider>
          <main className={styles.main}>{children}</main>
          <div id="transaction-modal-root" />
          <MobileNavBar />
        </TransactionsProvider>
      </Suspense>
    </SWRConfig>
  )
}
