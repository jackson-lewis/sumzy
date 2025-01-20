'use client'

import Link, { LinkProps } from 'next/link'
import { useSearchParams } from 'next/navigation'
import { TransactionDirection, TransactionFrequency } from '@/types'
import styles from './style.module.scss'

export default function FrequencySelector({
  direction
}: {
  direction: TransactionDirection
}) {
  const path = direction === 'expense' ? 'expenses' : 'income'
  const searchParams = useSearchParams()
  const frequency = (searchParams.get('frequency') ||
    'one_time') as TransactionFrequency

  const oneTimeProps: React.AnchorHTMLAttributes<HTMLAnchorElement> &
    LinkProps &
    React.RefAttributes<HTMLAnchorElement> = {
    href: `/dashboard/${path}?frequency=one_time`
  }

  const recurringProps: React.AnchorHTMLAttributes<HTMLAnchorElement> &
    LinkProps &
    React.RefAttributes<HTMLAnchorElement> = {
    href: `/dashboard/${path}?frequency=recurring`
  }

  if (frequency === 'one_time') {
    oneTimeProps['aria-current'] = 'page'
  }

  if (frequency === 'recurring') {
    recurringProps['aria-current'] = 'page'
  }

  return (
    <div className={styles.selector}>
      <Link {...oneTimeProps}>One time</Link>
      <Link {...recurringProps}>Recurring</Link>
    </div>
  )
}
