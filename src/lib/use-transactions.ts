import { useContext } from 'react'
import { TransactionsContext } from './transactions-context'

export default function useTransactions() {
  const context = useContext(TransactionsContext)

  if (!context) {
    throw new Error(
      'useTransactions must be used within a TransactionsProvider'
    )
  }

  return context
}
