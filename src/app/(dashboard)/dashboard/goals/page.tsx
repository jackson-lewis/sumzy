import Link from 'next/link'
import { getGoals } from '@/lib/goals'
import CreateGoalForm from '@/components/goals/create'

export default async function Goals() {
  const customTrackings = await getGoals()

  return (
    <div>
      <h1>Goals</h1>
      <CreateGoalForm />
      {customTrackings.length > 0 ? (
        <ul style={{ margin: '20px 0 0' }}>
          {customTrackings.map((tracking) => (
            <li key={tracking.id}>
              <Link href={`/dashboard/goals/${tracking.slug}`}>
                {tracking.name}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No goals found.</p>
      )}
    </div>
  )
}
