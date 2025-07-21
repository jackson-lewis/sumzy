import { useFormStatus } from 'react-dom'
import LoadingIcon from '@/components/shared/loading-icon'
import { Button } from '@/components/ui/button'
import styles from './style.module.scss'

export default function SubmitButton({
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      disabled={pending}
      className={styles.submit}
      {...rest}
    >
      {children}
      {pending && (
        <div className={styles.loadingWrapper}>
          <LoadingIcon color="var(--background)" />
        </div>
      )}
    </Button>
  )
}
