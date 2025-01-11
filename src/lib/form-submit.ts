'use client'

import { useSearchParams } from 'next/navigation'


export function useActiveYear() {
  const searchParams = useSearchParams()
  const today = new Date()

  return searchParams.get('year') || 
    today.getFullYear().toString()
}

export function useActiveMonth() {
  const searchParams = useSearchParams()
  const today = new Date()

  return searchParams.get('month') || 
    (today.getMonth() + 1).toString()
}
