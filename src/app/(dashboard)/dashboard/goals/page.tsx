import Link from 'next/link'
import { getGoals } from '@/lib/goals'
import CreateGoalForm from '@/components/goals/create'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import PageHeader from '@/components/ui/page-header'

export default async function Goals() {
  const goals = await getGoals()

  return (
    <div>
      <PageHeader
        title="Goals"
        backHref="/dashboard"
        action={<CreateGoalForm />}
      />
      {goals.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {goals.map((goal) => (
            <Link
              key={goal.id}
              href={`/dashboard/goals/${goal.slug}`}
              className="block"
            >
              <Card className="h-full transition-all hover:shadow-md hover:scale-[1.02] cursor-pointer bg-muted">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {goal.name}
                  </CardTitle>
                  <svg
                    className="h-4 w-4 text-muted-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <p>No goals found.</p>
      )}
    </div>
  )
}
