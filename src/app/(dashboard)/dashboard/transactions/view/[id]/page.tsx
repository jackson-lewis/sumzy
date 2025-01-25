import Link from 'next/link'
import Details from '@/components/transaction/modal/details'

export default async function ViewTransaction({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const id = (await params).id
  return (
    <>
      <Link href="/dashboard/transactions">Back to transactions</Link>
      <Details id={id} />
    </>
  )
}
