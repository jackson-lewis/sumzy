import { SearchParams } from 'next/dist/server/request/search-params'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard ~ Sumzy'
}

export default async function Dashboard({
  searchParams
}: {
  searchParams: Promise<SearchParams>
}) {
  const { action } = await searchParams

  return (
    <>
      <h1>Sumzy Dashboard</h1>
      <p>{action || ''}</p>
      <nav>
        <ul>
          <li>
            <Link href="/dashboard/goals">Goals</Link>
          </li>
        </ul>
      </nav>
    </>
  )
}
