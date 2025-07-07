export interface NetWorthAccount {
  id: number
  name: string
}

export interface NetWorthAccountBalance {
  id: number
  accountId: number
  balance: number
  account?: NetWorthAccount
}

export interface NetWorthSnapshot {
  id: number
  snapshotDate: string
  balances: NetWorthAccountBalance[]
}
