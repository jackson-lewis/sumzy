import Link from 'next/link'
import styles from './style.module.scss'


export default function FormField({
  label,
  name,
  type,
  ...rest
}: {
  label: string
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={styles.field}>
      <label htmlFor={name}>{label}</label>
      {(name === 'password' && rest.autoComplete === 'current-password') && (
        <Link
          href="/sign-in/forgot-password"
          className={styles.forgotPassword}
        >
          Forgot password?
        </Link>
      )}
      <input
        type={type}
        name={name}
        id={name}
        data-testid={name}
        required
        {...rest}
      />
    </div>
  )
}