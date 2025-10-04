import { getGoal } from '@/lib/goals'
import AddEntryForm from '@/components/goals/add-entry-form'
import ChartWrapper from '@/components/goals/chart'
import GoalDeleteButton from '@/components/goals/delete/indes'
import GoalSummary from '@/components/goals/summary'
import Table from '@/components/goals/table'
import PageHeader from '@/components/ui/page-header'

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
      <PageHeader
        backHref="/dashboard/goals"
        title={goal.name}
        action={<AddEntryForm goal={goal} />}
      />
      <GoalSummary goal={goal} />
      <ChartWrapper id={goal.id} />
      <Table id={goal.id} />
      <div className="mt-8 text-center">
        <span className="block mb-2">Created: {formattedDate}</span>
        <GoalDeleteButton goal={goal} />
      </div>
    </div>
  )
}
