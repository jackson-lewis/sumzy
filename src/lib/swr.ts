'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import {
  Category,
  DefaultCategory,
  Report,
  Transaction,
  User
} from '@prisma/client'
import useSWR from 'swr'

export const fetcher = async (url: string) => {
  return fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}${url}`).then((r) =>
    r.json()
  )
}

export async function fetcherWithToken(key: [string, string]) {
  return fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}${key[0]}`).then(
    (r) => r.json()
  )
}

export function getUserToken() {
  if (typeof document === 'undefined') {
    return
  }

  let token = ''
  const cookies = document.cookie.split(';')

  cookies.forEach((cookie) => {
    const [name, value] = cookie.split('=')

    if (name.trim() === 'token') {
      token = value.trim()
    }
  })

  return token
}

export function useTx() {
  return useSWR<Transaction[]>('/v1/transactions', fetcher)
}

export function useCategories() {
  return useSWR<{
    defaultCategories: DefaultCategory[]
    userCategories: Category[]
  }>(['/v1/transactions/categories', getUserToken()], fetcherWithToken)
}

export function useReports() {
  const searchParams = useSearchParams()
  const year = searchParams.get('year')
  const month = searchParams.get('month')

  return useSWR<Report>(
    [`/v1/reports/summary?year=${year}&month=${month}`, getUserToken()],
    fetcherWithToken
  )
}

export function useUser() {
  return useSWR<User>(['/v1/users', getUserToken()], fetcherWithToken)
}
