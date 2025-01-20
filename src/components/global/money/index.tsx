import { formatAmount } from '@/lib/money'
import styles from './style.module.scss'

export default function Money({ amount }: { amount: number }) {
  const formatted = formatAmount(amount)

  return <p className={styles.money}>{formatted}</p>
}
