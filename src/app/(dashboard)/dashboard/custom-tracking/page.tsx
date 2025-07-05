import Link from 'next/link'
import { getCustomTrackings } from '@/lib/custom-tracking'
import CreateCustomTrackingForm from '@/components/custom-tracking/create'

export default async function CustomTracking() {
  const customTrackings = await getCustomTrackings()

  return (
    <div>
      <h1>Custom Tracking</h1>
      <CreateCustomTrackingForm />
      {customTrackings.length > 0 ? (
        <ul style={{ margin: '20px 0 0' }}>
          {customTrackings.map((tracking) => (
            <li key={tracking.id}>
              <Link href={`/dashboard/custom-tracking/${tracking.slug}`}>
                {tracking.name}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No custom trackings found</p>
      )}
    </div>
  )
}
