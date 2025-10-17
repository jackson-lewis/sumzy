'use client'

import { ChangeEvent, useActionState, useEffect, useState } from 'react'
import { TransactionDirection } from '@/types'
import { CategoryType } from '@prisma/client'
import { logger } from '@sentry/nextjs'
import { transactionAction } from '@/lib/actions/transaction'
import { useCategories, useMerchants, useTx } from '@/lib/swr'
import useTransactions from '@/lib/use-transactions'
import { SubmitButton } from '@/components/site/user/form'
import { Button } from '@/components/ui/button'
import { CurrencyInput } from '@/components/ui/currency-input'
import { Input } from '@/components/ui/input'
import { ResponsiveDialog } from '@/components/ui/responsive-dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import DateSelector from './date-selector'

export default function TransactionDialog() {
  // Merchant select state
  const { data: merchants = [] } = useMerchants()
  const [merchantId, setMerchantId] = useState<string>('')
  const { closeEditModal, transaction, transactionSetup, setTransactionSetup } =
    useTransactions()
  const [amountValue, setAmountValue] = useState<string>('')
  const [categoryValue, setCategoryValue] = useState<string>()
  const [categoryType, setCategoryType] = useState<CategoryType>()
  const [descValue, setDescValue] = useState<string>('')
  const update = !!transaction
  const [state, formAction, pending] = useActionState(transactionAction, null)
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
      logger.info('Mutating transactions after action state change.', {
        transactionId: state.id
      })

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
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="update" value={update ? 'true' : 'false'} />
      <input type="hidden" name="id" value={transaction?.id} />
      <input type="hidden" name="categoryType" value={categoryType} />
      <input type="hidden" name="direction" value={transactionSetup[0]} />
      <fieldset name="direction" className="flex gap-4 mb-4">
        <Button
          type="button"
          variant={transactionSetup[0] === 'income' ? 'default' : 'outline'}
          onClick={() =>
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            handleDirectionChange({ target: { value: 'income' } } as any)
          }
          className="flex-grow"
        >
          Income
        </Button>
        <Button
          type="button"
          variant={transactionSetup[0] === 'expense' ? 'default' : 'outline'}
          onClick={() =>
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            handleDirectionChange({ target: { value: 'expense' } } as any)
          }
          className="flex-grow"
        >
          Expense
        </Button>
      </fieldset>
      <fieldset name="details">
        <CurrencyInput
          name="amount"
          autoFocus={true}
          value={amountValue ?? (Number(amountValue) * 1).toString()}
          onChange={(e) =>
            setAmountValue(
              (
                Number(e.target.value) *
                (transactionSetup[0] === 'expense' ? -1 : 1)
              ).toString()
            )
          }
        />
        <div className="mt-4">
          <label htmlFor="merchantId" className="block mb-1">
            Merchant
          </label>
          <Select
            name="merchantId"
            value={merchantId}
            onValueChange={(val) => {
              setMerchantId(val)
            }}
            required
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select merchant" />
            </SelectTrigger>
            <SelectContent>
              {merchants.map((merchant) => (
                <SelectItem key={merchant.id} value={merchant.id.toString()}>
                  {merchant.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {data ? (
          <div className="mt-4">
            <label htmlFor="categoryId" className="block mb-1">
              Category
            </label>
            <Select
              name="categoryId"
              value={categoryValue}
              onValueChange={(val) =>
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                handleCategoryChange({ target: { value: val } } as any)
              }
              required
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {data.defaultCategories.map((category) => (
                  <SelectItem key={`d${category.id}`} value={`d${category.id}`}>
                    {category.name}
                  </SelectItem>
                ))}
                {data.userCategories.map((category) => (
                  <SelectItem key={`u${category.id}`} value={`u${category.id}`}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : (
          <p>Failed to load categories</p>
        )}
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
        <div className="mt-4">
          <DateSelector value={transaction?.date} />
        </div>
        <SubmitButton className="w-full" disabled={pending}>
          {pending
            ? update
              ? 'Updating...'
              : 'Adding...'
            : update
              ? 'Update'
              : 'Add'}
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
