'use client'

import type {
  NetWorthAccountBalance,
  NetWorthSnapshot
} from '@/types/net-worth'
import { useNetWorthSnapshots } from '@/lib/swr/net-worth-snapshots'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

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

  if (isLoading) {
    return <p>Loading...</p>
  }

  if (!snapshots.length) {
    return <p>No snapshots found.</p>
  }

  // Collect all unique accounts and dates
  const accountMap = new Map<number, string>()
  const dateMap = new Map<string, number>() // date string -> snapshot id
  snapshots.forEach((snap) => {
    dateMap.set(snap.snapshotDate, snap.id)
    snap.balances.forEach((bal) => {
      if (bal.account) {
        accountMap.set(bal.accountId, bal.account.name)
      } else {
        accountMap.set(bal.accountId, String(bal.accountId))
      }
    })
  })

  const accountIds = Array.from(accountMap.keys())
  const dates = Array.from(dateMap.keys()).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  )

  // Build a lookup: accountId -> date -> balance
  const balanceLookup: Record<number, Record<string, number>> = {}
  accountIds.forEach((accountId) => {
    balanceLookup[accountId] = {}
    snapshots.forEach((snap) => {
      const bal = snap.balances.find((b) => b.accountId === accountId)
      balanceLookup[accountId][snap.snapshotDate] = bal
        ? Number(bal.balance)
        : 0
    })
  })

  // Build totals for each date
  const totalsByDate: Record<string, number> = {}
  dates.forEach((date) => {
    totalsByDate[date] = accountIds.reduce((sum, accountId) => {
      const val = balanceLookup[accountId][date]
      return sum + (val || 0)
    }, 0)
  })

  return (
    <Table className="w-full mt-8">
      <TableHeader>
        <TableRow>
          <TableHead className="text-left">Account</TableHead>
          {dates.map((date) => (
            <TableHead
              key={date}
              className="text-right font-mono tabular-nums font-normal"
            >
              {new Date(date).toLocaleDateString()}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {accountIds.map((accountId) => (
          <TableRow key={accountId}>
            <TableCell className="py-2 font-medium">
              {accountMap.get(accountId)}
            </TableCell>
            {dates.map((date) => (
              <TableCell
                key={date}
                className="py-2 text-right font-mono tabular-nums"
              >
                {balanceLookup[accountId][date] !== undefined ? (
                  balanceLookup[accountId][date].toLocaleString(undefined, {
                    style: 'currency',
                    currency: 'GBP'
                  })
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
            ))}
          </TableRow>
        ))}
        <TableRow>
          <TableCell className="py-2 font-semibold">Total</TableCell>
          {dates.map((date) => (
            <TableCell
              key={date}
              className="py-2 text-right font-mono tabular-nums font-semibold"
            >
              {totalsByDate[date].toLocaleString(undefined, {
                style: 'currency',
                currency: 'GBP'
              })}
            </TableCell>
          ))}
        </TableRow>
      </TableBody>
    </Table>
  )
}
