import Form from 'next/form'
import Container from '../container'

export default function UserForm({
  action,
  children
}: {
  action: (payload: FormData) => void
  children: React.ReactNode
}) {
  return (
    <Container>
      <Form action={action}>{children}</Form>
    </Container>
  )
}
