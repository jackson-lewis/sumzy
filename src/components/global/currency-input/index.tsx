import {
  DetailedHTMLProps,
  Dispatch,
  HTMLAttributes,
  SetStateAction,
  useEffect,
  useState
} from 'react'
import styles from './style.module.scss'
import { Transaction } from '@/types'

/**
 * Props are passed to the `<input />` except for `value`
 * and `onChange` which get overridden 
 */
export default function CurrencyInput({
  value,
  setAmountValue,
  ...rest
} : {
  value?: Transaction['amount']
  setAmountValue: Dispatch<SetStateAction<string>>
  autoFocus?: boolean
} & DetailedHTMLProps<
  HTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>) {
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    setInputValue(() => {
      const rawValue = value
      let parsedValue = ''
    
      if (rawValue) {
        parsedValue = (rawValue < 0 ?
          (rawValue * -1) :
          rawValue).toString()
      }

      return parsedValue
    })
  }, [value])

  const newProps = {
    ...rest,
    value: inputValue
  }

  return (
    <div className={styles.wrapper}>
      <span>£</span>
      <input
        type="number"
        name="amount"
        step="0.01"
        required
        {...newProps}
        onChange={(event) => {
          setAmountValue(
            (event.target as HTMLInputElement)
              .value
          )
        }}
      />
    </div>
  )
}