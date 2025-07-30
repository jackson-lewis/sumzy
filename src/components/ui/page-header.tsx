import { ReactNode } from 'react'
import { BackButton } from './back-button'
import { PageTitle } from './page-title'

export default function PageHeader({
  action,
  backHref,
  title
}: {
  action?: ReactNode
  backHref?: string
  title: string
}) {
  return (
    <div className="relative flex items-center justify-center mb-4">
      {backHref && (
        <BackButton
          href={backHref}
          className="absolute left-0 top-1/2 -translate-y-1/2"
        />
      )}
      <PageTitle className="text-center w-full">{title}</PageTitle>
      {action && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2">
          {action}
        </div>
      )}
    </div>
  )
}
