import * as React from 'react'
import { cn } from '@/lib/utils'

interface PageTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode
}

export function PageTitle({ children, className, ...props }: PageTitleProps) {
  return (
    <h1 className={cn('text-2xl font-bold', className)} {...props}>
      {children}
    </h1>
  )
}
