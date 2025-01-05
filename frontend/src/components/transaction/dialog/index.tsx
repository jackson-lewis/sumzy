'use client'

import {
  ChangeEvent,
  useActionState,
  useEffect,
  useRef,
  useState
} from 'react'
import Form from 'next/form'
import { CategoryType } from '@prisma/client'
import DateSelector from './date-selector'
import CurrencyInput from '@/components/global/currency-input'
import {
  TransactionDirection,
  TransactionFrequency,
} from '@/types'
import useTransactions from '@/lib/use-transactions'
import { transactionAction } from '@/lib/actions/transaction'
import { useCategories, useTx } from '@/lib/swr'
import styles from './style.module.scss'
import { SubmitButton } from '@/components/site/user/form'


export default function TransactionDialog() {
  const {
    closeEditModal,
    dialogRef,
    transaction,
    transactionSetup,
    setTransactionSetup
  } = useTransactions()
  const [amountValue, setAmountValue] = useState<string>('')
  const [categoryValue, setCategoryValue] = useState<string>()
  const [categoryType, setCategoryType] = useState<CategoryType>()
  const [descValue, setDescValue] = useState<string>('')
  const update = !!transaction
  const [state, formAction] = useActionState(
    transactionAction,
    null
  )
  const { data } = useCategories()
  const formRef = useRef<HTMLFormElement>(null)
  const { data: transactions, mutate } = useTx()

  useEffect(() => {
    if (transaction) {
      setAmountValue(transaction.amount.toString())
      setCategoryValue(
        (
          transaction.categoryType === 'DEFAULT' ? 
            `d${transaction.defaultCategoryId}` : `u${transaction.categoryId}`
        ) || ''
      )
      setDescValue(transaction.description || '')
    }
  }, [transaction])

  useEffect(() => {
    if (transactions && state && !(state instanceof Error)) {
      if (update)  {
        mutate(transactions.map((tx) => {
          if (tx.id === state.id) {
            return state
          }
          return tx
        }))
      } else {
        mutate([ ...transactions, state ])
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
    formRef.current?.reset()
  }

  function handleDirectionChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    if (update) {
      return
    }

    setTransactionSetup((setup) => {
      return [
        event.target.value as TransactionDirection,
        setup[1]
      ]
    })
  }

  function handleFrequencyChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    if (update) {
      return
    }

    setTransactionSetup((setup) => {
      return [
        setup[0],
        event.target.value as TransactionFrequency
      ]
    })
  }

  function handleCategoryChange(
    event: ChangeEvent<HTMLSelectElement>
  ) {
    const categoryType: CategoryType = 
      event.target.value[0] === 'd' ? 'DEFAULT' : 'USER'

    setCategoryValue(event.target.value)
    setCategoryType(categoryType)
  }

  return (
    <dialog ref={dialogRef} className={styles.dialog}>
      <Form action={formAction} ref={formRef}>
        <input
          type="hidden"
          name="update"
          value={update ? 'true' : 'false'}
        />
        <input
          type="hidden"
          name="id"
          value={transaction?.id}
        />
        <input
          type="hidden"
          name="categoryType"
          value={categoryType}
        />
        <fieldset name="direction" className={styles.direction}>
          <div className={[styles.field, styles.type].join(' ')}>
            <div className={styles['styled-radio']}>
              <input
                type="radio"
                name="direction"
                value="income"
                id="direction-income"
                checked={transactionSetup[0] === 'income'}
                onChange={handleDirectionChange}
              />
              <label htmlFor="direction-income">Income</label>
            </div>
            <div className={styles['styled-radio']}>
              <input
                type="radio"
                name="direction"
                value="expense"
                id="direction-expense"
                checked={transactionSetup[0] === 'expense'}
                onChange={handleDirectionChange}
              />
              <label htmlFor="direction-expense">Expense</label>
            </div>
          </div>
        </fieldset>
        <fieldset name="frequency" className={styles.frequency}>
          <div className={[styles.field, styles.type].join(' ')}>
            <div className={styles['styled-radio']}>
              <input
                type="radio"
                name="frequency"
                value="one_time"
                id="frequency-one_time"
                checked={transactionSetup[1] === 'one_time'}
                onChange={handleFrequencyChange}
              />
              <label htmlFor="frequency-one_time">One-time</label>
            </div>
            <div className={styles['styled-radio']}>
              <input
                type="radio"
                name="frequency"
                value="recurring"
                id="frequency-recurring"
                checked={transactionSetup[1] === 'recurring'}
                onChange={handleFrequencyChange}
              />
              <label htmlFor="frequency-recurring">Recurring</label>
            </div>
          </div>
        </fieldset>
        <fieldset name="details">
          <CurrencyInput
            autoFocus={true}
            value={Number(amountValue)}
            setAmountValue={setAmountValue}
          />
          <div className={styles.field} style={{ marginTop: 10 }}>
            <label htmlFor="desc">Description</label>
            <input
              type="text"
              name="description"
              id="desc"
              value={descValue}
              onChange={(event) => setDescValue(event.target.value)}
              className={styles.description}
            />
          </div>
          {data ? (
            <div className={styles.field}>
              <label htmlFor="category">Category</label>
              <select
                name="categoryId"
                id="categoryId"
                value={categoryValue}
                required
                onChange={handleCategoryChange}
                className={styles.category}
              >
                {data.defaultCategories.map((category) => (
                  <option
                    key={`d${category.id}`}
                    value={`d${category.id}`}
                  >
                    {category.name}
                  </option>
                ))}
                {data.userCategories.map((category) => (
                  <option
                    key={`u${category.id}`}
                    value={`u${category.id}`}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <p>Failed to load categories</p>
          )}
          <DateSelector value={transaction?.date} />
          <SubmitButton>
            {update ? 'Update' : 'Add'}
          </SubmitButton>
          <button
            type="button"
            onClick={() => {
              closeAction()
            }}
            className={styles.cancel}
          >
            Cancel
          </button>
        </fieldset>
      </Form>
    </dialog>
  )
}
