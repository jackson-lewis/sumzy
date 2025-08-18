import { Suspense } from 'react'
import { SWRConfig } from 'swr'
import TransactionsProvider from '@/lib/transactions-context'

// Removed SCSS import

export default function DashboardLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <SWRConfig>
      <Suspense>
        <TransactionsProvider>
          <main className="px-5 pt-5 pb-[100px]">{children}</main>
          <div id="transaction-modal-root" />
        </TransactionsProvider>
      </Suspense>
    </SWRConfig>
  )
}
