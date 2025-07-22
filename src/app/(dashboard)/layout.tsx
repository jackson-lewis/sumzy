import { Suspense } from 'react'
import { SWRConfig } from 'swr'
import TransactionsProvider from '@/lib/transactions-context'
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
        </TransactionsProvider>
      </Suspense>
    </SWRConfig>
  )
}
