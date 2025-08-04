'use client'

import { ChangeEvent, useActionState, useEffect, useState } from 'react'
import { TransactionDirection } from '@/types'
import { CategoryType } from '@prisma/client'
import { transactionAction } from '@/lib/actions/transaction'
import { useCategories, useTx } from '@/lib/swr'
import useTransactions from '@/lib/use-transactions'
import { SubmitButton } from '@/components/site/user/form'
import { Button } from '@/components/ui/button'
import { CurrencyInput } from '@/components/ui/currency-input'
import { Input } from '@/components/ui/input'
import { ResponsiveDialog } from '@/components/ui/responsive-dialog'
import DateSelector from './date-selector'

export default function TransactionDialog() {
  const { closeEditModal, transaction, transactionSetup, setTransactionSetup } =
    useTransactions()
  const [amountValue, setAmountValue] = useState<string>('')
  const [categoryValue, setCategoryValue] = useState<string>()
  const [categoryType, setCategoryType] = useState<CategoryType>()
  const [descValue, setDescValue] = useState<string>('')
  const update = !!transaction
  const [state, formAction] = useActionState(transactionAction, null)
  const { data } = useCategories()
  const { data: transactions, mutate } = useTx()

  useEffect(() => {
    if (transaction) {
      setAmountValue(transaction.amount.toString())
      setCategoryValue(
        (transaction.categoryType === 'DEFAULT'
          ? `d${transaction.defaultCategoryId}`
          : `u${transaction.categoryId}`) || ''
      )
      setDescValue(transaction.description || '')
    }
  }, [transaction])

  useEffect(() => {
    if (transactions && state && !(state instanceof Error)) {
      if (update) {
        mutate(
          transactions.map((tx) => {
            if (tx.id === state.id) {
              return state
            }
            return tx
          })
        )
      } else {
        mutate([...transactions, state])
      }
      closeAction()
    }
  }, [state])

  function closeAction() {
    closeEditModal()
    setAmountValue('')
    setCategoryValue('d1')
    setCategoryType('DEFAULT')
    setDescValue('')
    setTransactionSetup([undefined, undefined])
  }

  function handleDirectionChange(event: ChangeEvent<HTMLInputElement>) {
    if (update) {
      return
    }
    setTransactionSetup((setup) => {
      return [event.target.value as TransactionDirection, setup[1]]
    })
  }

  function handleCategoryChange(event: ChangeEvent<HTMLSelectElement>) {
    const categoryType: CategoryType =
      event.target.value[0] === 'd' ? 'DEFAULT' : 'USER'
    setCategoryValue(event.target.value)
    setCategoryType(categoryType)
  }

  const formContent = (
    <form action={formAction} className="space-y-4 p-4">
      <input type="hidden" name="update" value={update ? 'true' : 'false'} />
      <input type="hidden" name="id" value={transaction?.id} />
      <input type="hidden" name="categoryType" value={categoryType} />
      <fieldset name="direction" className="flex gap-4 mb-2">
        <div>
          <label className="block mb-1">Direction</label>
          <div className="flex gap-2">
            <Button
              type="button"
              variant={transactionSetup[0] === 'income' ? 'default' : 'outline'}
              onClick={() =>
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                handleDirectionChange({ target: { value: 'income' } } as any)
              }
            >
              Income
            </Button>
            <Button
              type="button"
              variant={
                transactionSetup[0] === 'expense' ? 'default' : 'outline'
              }
              onClick={() =>
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                handleDirectionChange({ target: { value: 'expense' } } as any)
              }
            >
              Expense
            </Button>
          </div>
        </div>
      </fieldset>
      <fieldset name="details">
        <CurrencyInput
          name="amount"
          autoFocus={true}
          value={Number(amountValue)}
          onChange={(e) => setAmountValue(e.target.value)}
        />
        <div className="mt-4">
          <label htmlFor="desc" className="block mb-1">
            Description
          </label>
          <Input
            type="text"
            name="description"
            id="desc"
            value={descValue}
            onChange={(event) => setDescValue(event.target.value)}
          />
        </div>
        {data ? (
          <div className="mt-4">
            <label htmlFor="category" className="block mb-1">
              Category
            </label>
            <select
              name="categoryId"
              id="categoryId"
              value={categoryValue}
              required
              onChange={handleCategoryChange}
              className="w-full border rounded px-2 py-1"
            >
              {data.defaultCategories.map((category) => (
                <option key={`d${category.id}`} value={`d${category.id}`}>
                  {category.name}
                </option>
              ))}
              {data.userCategories.map((category) => (
                <option key={`u${category.id}`} value={`u${category.id}`}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <p>Failed to load categories</p>
        )}
        <div className="mt-4">
          <DateSelector value={transaction?.date} />
        </div>
        <SubmitButton className="w-full">
          {update ? 'Update' : 'Add'}
        </SubmitButton>
      </fieldset>
    </form>
  )

  return (
    <ResponsiveDialog
      title={update ? 'Edit Transaction' : 'Add Transaction'}
      formSubmitted={!!state && !(state instanceof Error)}
    >
      {formContent}
    </ResponsiveDialog>
  )
}
