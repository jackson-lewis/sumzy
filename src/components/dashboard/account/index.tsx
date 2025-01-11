import { useActionState, useEffect } from 'react'
import Form from 'next/form'
import { Button } from '@/components/shared/button'
import { useUser } from '@/lib/swr'
import { updateUser } from '@/lib/actions/user'
import styles from './style.module.scss'

export default function AccountForm() {
  const { data, mutate } = useUser()
  const [updatedUser, formAction, pending] = useActionState(
    updateUser,
    null
  )

  useEffect(() => {
    if (updatedUser) {
      mutate({ ...data, ...updatedUser })
    }
  }, [updatedUser, mutate])

  return (
    <Form action={formAction} className={styles.form}>
      <FormField
        label="Name"
        name="name"
        type="text"
        defaultValue={data?.name}
      />
      <FormField
        label="Email"
        name="email"
        type="email"
        defaultValue={data?.email}
      />
      <Button
        disabled={pending}
        variant="fill"
        color="green"
      >
        Save
      </Button>
    </Form>
  )
}


export function FormField({
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
      <input
        type={type}
        name={name}
        id={name}
        required
        {...rest}
      />
    </div>
  )
}
