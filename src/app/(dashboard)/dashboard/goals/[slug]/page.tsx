import { getGoal } from '@/lib/goals'
import AddEntryForm from '@/components/goals/add-entry-form'
import ChartWrapper from '@/components/goals/chart'
import Table from '@/components/goals/table'

export default async function Goal({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const goal = await getGoal(slug)
  const createdDate = new Date(goal.createdAt)
  const formattedDate = createdDate.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })

  return (
    <div>
      <h1>{goal.name}</h1>
      <span>Created: {formattedDate}</span>
      <AddEntryForm goal={goal} />
      <ChartWrapper id={goal.id} />
      <Table id={goal.id} />
    </div>
  )
}
