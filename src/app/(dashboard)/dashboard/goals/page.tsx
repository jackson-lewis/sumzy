import Link from 'next/link'
import { getGoals } from '@/lib/goals'
import CreateGoalForm from '@/components/goals/create'

export default async function Goals() {
  const goals = await getGoals()

  return (
    <div>
      <h1>Goals</h1>
      <CreateGoalForm />
      {goals.length > 0 ? (
        <ul style={{ margin: '20px 0 0' }}>
          {goals.map((goal) => (
            <li key={goal.id}>
              <Link href={`/dashboard/goals/${goal.slug}`}>{goal.name}</Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No goals found.</p>
      )}
    </div>
  )
}
