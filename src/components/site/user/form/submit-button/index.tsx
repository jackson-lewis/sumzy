import { useFormStatus } from 'react-dom'
import { Button, ButtonProps } from '@/components/shared/button'
import LoadingIcon from '@/components/shared/loading-icon'
import styles from './style.module.scss'

export default function SubmitButton({
  children,
  ...rest
}: ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { pending } = useFormStatus()

  return (
    <Button
      variant="fill"
      color="green"
      className={styles.submit}
      disabled={pending}
      {...rest}
    >
      {children}
      {pending && (
        <div className={styles.loadingWrapper}>
          <LoadingIcon color="var(--black)" />
        </div>
      )}
    </Button>
  )
}
