import Link from 'next/link'
import styles from './style.module.scss'

export default function FormField({
  label,
  name,
  type,
  error,
  ...rest
}: {
  label: string
  error?: string[]
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={[styles.field, error && styles.error].join(' ')}>
      <label htmlFor={name}>{label}</label>
      {name === 'password' && rest.autoComplete === 'current-password' && (
        <Link href="/sign-in/forgot-password" className={styles.forgotPassword}>
          Forgot password?
        </Link>
      )}
      <input
        type={type}
        name={name}
        id={name}
        aria-describedby={`${name}-error`}
        data-testid={name}
        {...rest}
      />
      {error && (
        <p id={`${name}-error`} className={styles['error-message']}>
          {error[0]}
        </p>
      )}
    </div>
  )
}
