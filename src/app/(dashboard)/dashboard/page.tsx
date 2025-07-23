import { SearchParams } from 'next/dist/server/request/search-params'
import Link from 'next/link'
import { Metadata } from 'next'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { PageTitle } from '@/components/ui/page-title'

export const metadata: Metadata = {
  title: 'Dashboard ~ Sumzy'
}

export default async function Dashboard({
  searchParams
}: {
  searchParams: Promise<SearchParams>
}) {
  const { action } = await searchParams

  const ROUTES = [
    {
      name: 'Goals',
      href: '/dashboard/goals'
    },
    {
      name: 'Net Worth',
      href: '/dashboard/net-worth'
    },
    {
      name: 'Account',
      href: '/dashboard/account'
    }
  ]

  return (
    <>
      <PageTitle className="text-center w-full mb-4">Sumzy</PageTitle>
      <p>{action || ''}</p>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {ROUTES.map((route) => (
          <Link key={route.name} href={route.href} className="block">
            <Card className="h-full transition-all hover:shadow-md hover:scale-[1.02] cursor-pointer bg-muted">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  {route.name}
                </CardTitle>
                <svg
                  className="h-4 w-4 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </>
  )
}
