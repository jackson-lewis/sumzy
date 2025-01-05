import type { Metadata } from 'next'
import { Onest } from 'next/font/google'
import './globals.scss'

const onest = Onest({
  variable: '--font-onest',
  subsets: ["latin"]
})

export const metadata: Metadata = {
  title: 'Sumzy - Personal Finance Tracking'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en-GB">
      <body className={onest.variable}>
        {children}
      </body>
    </html>
  )
}
