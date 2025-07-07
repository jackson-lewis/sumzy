import useSWR from 'swr'
import { getUserToken } from '../swr'

export function useNetWorthAccounts() {
  return useSWR('/api/v1/net-worth/accounts', (url) =>
    fetch(url, {
      headers: { Authorization: `Bearer ${getUserToken()}` }
    }).then((r) => r.json())
  )
}
