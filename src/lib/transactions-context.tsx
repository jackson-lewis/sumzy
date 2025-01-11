'use client'

import {
  createContext,
  Dispatch,
  ReactNode,
  RefObject,
  SetStateAction,
  useRef,
  useState
} from 'react'
import {
  TransactionDialogSetup,
  TransactionDirection,
  TransactionFrequency
} from '@/types'
import { Transaction } from '@prisma/client'


export const TransactionsContext = createContext<{
  transaction: Transaction | undefined
  setTransaction: Dispatch<SetStateAction<Transaction | undefined>>
  transactionSetup: TransactionDialogSetup
  setTransactionSetup: Dispatch<SetStateAction<TransactionDialogSetup>>
  dialogRef: RefObject<HTMLDialogElement | null>
  showEditModal: (
    direction?: TransactionDirection,
    frequency?: TransactionFrequency,
    transaction?: Transaction
  ) => void
  closeEditModal: () => void
} | null>(null)

export default function TransactionsProvider({
  children
}: {
  children: ReactNode
}) {
  const [transaction, setTransaction] = useState<Transaction>()
  const [transactionSetup, setTransactionSetup] = useState<
    TransactionDialogSetup
  >([undefined, undefined])

  const dialogRef = useRef<HTMLDialogElement>(null)

  function showEditModal(
    direction?: TransactionDirection,
    frequency?: TransactionFrequency,
    transaction?: Transaction
  ) {
    const dialog = dialogRef.current

    if (!dialog) {
      console.log('dialog not found')
      return
    }

    setTransactionSetup((setup) => {
      if (direction) {
        setup[0] = direction
      }
      if (frequency) {
        setup[1] = frequency
      }
      return [...setup]
    })

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
    <TransactionsContext.Provider value={{
      transaction,
      setTransaction,
      transactionSetup,
      setTransactionSetup,
      dialogRef,
      showEditModal,
      closeEditModal
    }}>
      {children}
    </TransactionsContext.Provider>
  )
}