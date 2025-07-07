import { NetWorthSnapshot } from '@/types/net-worth'
import useSWR from 'swr'
import { getUserToken } from '../swr'

export function useNetWorthSnapshots() {
  return useSWR<NetWorthSnapshot[]>(
    '/api/v1/net-worth/snapshots',
    (url: string) =>
      fetch(url, {
        headers: { Authorization: `Bearer ${getUserToken()}` }
      }).then((r) => r.json())
  )
}
