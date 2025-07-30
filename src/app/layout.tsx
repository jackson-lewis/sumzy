import { Onest } from 'next/font/google'
import { CircleCheck } from 'lucide-react'
import type { Metadata } from 'next'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const onest = Onest({
  variable: '--font-onest',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: 'Sumzy - Personal Finance Tracking'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en-GB" className="dark">
      <body className={onest.variable}>
        {children}
        <Toaster
          position="top-center"
          duration={20000}
          icons={{
            success: <CircleCheck stroke="var(--primary)" />
          }}
          toastOptions={{
            classNames: {
              title: '!mx-2'
            }
          }}
        />
      </body>
    </html>
  )
}
