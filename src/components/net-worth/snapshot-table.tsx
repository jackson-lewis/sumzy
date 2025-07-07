'use client'

import type {
  NetWorthAccountBalance,
  NetWorthSnapshot
} from '@/types/net-worth'
import { useNetWorthSnapshots } from '@/lib/swr/net-worth-snapshots'

// Helper to cast API data to the correct type
function normalizeSnapshots(raw: NetWorthSnapshot[]): NetWorthSnapshot[] {
  return raw.map((snap) => ({
    ...snap,
    balances: (snap.balances || []).map((bal: NetWorthAccountBalance) => ({
      ...bal,
      balance: Number(bal.balance),
      account: bal.account
        ? { id: bal.account.id, name: bal.account.name }
        : undefined
    }))
  }))
}

export default function NetWorthSnapshotTable() {
  const { data = [], isLoading } = useNetWorthSnapshots()
  const snapshots: NetWorthSnapshot[] = normalizeSnapshots(data)

  if (isLoading) return <p>Loading...</p>
  if (!snapshots.length) return <p>No snapshots found.</p>

  // Collect all unique accounts from all snapshots
  const accountMap = new Map<number, string>()
  snapshots.forEach((snap) => {
    snap.balances.forEach((bal) => {
      if (bal.account) accountMap.set(bal.accountId, bal.account.name)
      else accountMap.set(bal.accountId, String(bal.accountId))
    })
  })
  const accountIds = Array.from(accountMap.keys())

  return (
    <table
      style={{ width: '100%', marginTop: '2rem', borderCollapse: 'collapse' }}
    >
      <thead>
        <tr>
          <th
            style={{
              textAlign: 'left',
              borderBottom: '1px solid #ccc',
              padding: '0.5rem'
            }}
          >
            Date
          </th>
          {accountIds.map((id) => (
            <th
              key={id}
              style={{
                textAlign: 'right',
                borderBottom: '1px solid #ccc',
                padding: '0.5rem'
              }}
            >
              {accountMap.get(id)}
            </th>
          ))}
          <th
            style={{
              textAlign: 'right',
              borderBottom: '1px solid #ccc',
              padding: '0.5rem'
            }}
          >
            Total
          </th>
        </tr>
      </thead>
      <tbody>
        {snapshots.map((snap) => {
          const balancesByAccount: Record<number, number> = {}
          snap.balances.forEach((bal) => {
            balancesByAccount[bal.accountId] = Number(bal.balance)
          })
          const total = accountIds.reduce(
            (sum, id) => sum + (balancesByAccount[id] || 0),
            0
          )
          return (
            <tr key={snap.id}>
              <td style={{ padding: '0.5rem' }}>
                {new Date(snap.snapshotDate).toLocaleDateString()}
              </td>
              {accountIds.map((id) => (
                <td key={id} style={{ padding: '0.5rem', textAlign: 'right' }}>
                  {balancesByAccount[id] !== undefined
                    ? balancesByAccount[id].toLocaleString(undefined, {
                        style: 'currency',
                        currency: 'GBP'
                      })
                    : '-'}
                </td>
              ))}
              <td
                style={{
                  padding: '0.5rem',
                  textAlign: 'right',
                  fontWeight: 500
                }}
              >
                {total.toLocaleString(undefined, {
                  style: 'currency',
                  currency: 'GBP'
                })}
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
