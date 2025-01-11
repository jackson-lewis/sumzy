import { Metadata } from 'next'
import { SearchParams } from 'next/dist/server/request/search-params'

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
    </>
  )
}