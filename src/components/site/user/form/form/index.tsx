import Form from 'next/form'
import Container from '../container'
import styles from './style.module.scss'

export default function UserForm({
  action,
  children
}: {
  action: (payload: FormData) => void
  children: React.ReactNode
}) {
  return (
    <Container>
      <Form action={action} className={styles.form}>
        {children}
      </Form>
    </Container>
  )
}
