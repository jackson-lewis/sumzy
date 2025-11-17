'use client'

import {
  Dispatch,
  ReactNode,
  RefObject,
  SetStateAction,
  createContext,
  useRef,
  useState
} from 'react'
import { Transaction } from '@prisma/client'

export const TransactionsContext = createContext<{
  transaction: Transaction | undefined
  setTransaction: Dispatch<SetStateAction<Transaction | undefined>>
  dialogRef: RefObject<HTMLDialogElement | null>
  showEditModal: (transaction?: Transaction) => void
  closeEditModal: () => void
} | null>(null)

export default function TransactionsProvider({
  children
}: {
  children: ReactNode
}) {
  const [transaction, setTransaction] = useState<Transaction>()

  const dialogRef = useRef<HTMLDialogElement>(null)

  function showEditModal(transaction?: Transaction) {
    const dialog = dialogRef.current

    if (!dialog) {
      console.log('dialog not found')
      return
    }

    setTransaction(transaction)

    dialog.showModal()
  }

  function closeEditModal() {
    const dialog = dialogRef.current

    if (!dialog) {
      return
    }

    dialog.close()
  }

  return (
    <TransactionsContext.Provider
      value={{
        transaction,
        setTransaction,
        dialogRef,
        showEditModal,
        closeEditModal
      }}
    >
      {children}
    </TransactionsContext.Provider>
  )
}
