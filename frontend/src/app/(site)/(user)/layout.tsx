import { Suspense } from 'react'

export default function SiteUserLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main style={{
      display: 'grid',
      alignItems: 'center'
    }}>
      <Suspense>
        {children}
      </Suspense>
    </main>
  )
}