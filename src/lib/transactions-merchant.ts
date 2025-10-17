import type { Transaction } from '@prisma/client'

export function getTransactionMerchant(
  transaction: Transaction,
  merchants?: { id: number; name: string }[]
) {
  if (!merchants || !transaction.merchantId) return undefined
  return merchants.find((m) => m.id === transaction.merchantId)
}
