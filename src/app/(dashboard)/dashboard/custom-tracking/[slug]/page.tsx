import { getCustomTracking } from '@/lib/custom-tracking'
import AddEntryForm from '@/components/custom-tracking/add-entry-form'
import ChartWrapper from '@/components/custom-tracking/chart'

export default async function CustomTracking({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const customTracking = await getCustomTracking(slug)
  const createdDate = new Date(customTracking.createdAt)
  const formattedDate = createdDate.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })

  return (
    <div>
      <h1>{customTracking.name}</h1>
      <span>Created: {formattedDate}</span>
      <AddEntryForm customTracking={customTracking} />
      <ChartWrapper />
    </div>
  )
}
