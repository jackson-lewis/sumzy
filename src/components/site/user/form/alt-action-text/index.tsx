import styles from './style.module.scss'

export default function AltActionText({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <p className={styles.altActionText}>{children}</p>
  )
}