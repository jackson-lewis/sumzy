import { getGoal } from '@/lib/goals'
import AddEntryForm from '@/components/goals/add-entry-form'
import ChartWrapper from '@/components/goals/chart'
import Table from '@/components/goals/table'
import { BackButton } from '@/components/ui/back-button'
import { PageTitle } from '@/components/ui/page-title'

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
      <div className="relative flex items-center justify-center mb-6">
        <BackButton
          href="/dashboard/goals"
          className="absolute left-0 top-1/2 -translate-y-1/2"
        />
        <PageTitle className="text-center w-full">{goal.name}</PageTitle>
        <AddEntryForm goal={goal} />
      </div>
      <ChartWrapper id={goal.id} />
      <Table id={goal.id} />
      <span className="block mt-8 text-center">Created: {formattedDate}</span>
    </div>
  )
}
