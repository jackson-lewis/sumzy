import { Button } from '@/components/ui/button'
import { PageTitle } from '@/components/ui/page-title'

export default function Home() {
  return (
    <main>
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <PageTitle className="text-center">Personal Finance Tracking</PageTitle>
        <Button asChild>
          <a href="/sign-up">Sign up</a>
        </Button>
      </div>
    </main>
  )
}
