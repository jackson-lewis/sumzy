import { useActionState, useEffect } from 'react'
import Form from 'next/form'
import { updateUser } from '@/lib/actions/user'
import { useUser } from '@/lib/swr'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function AccountForm() {
  const { data, mutate } = useUser()
  const [updatedUser, formAction, pending] = useActionState(updateUser, null)

  useEffect(() => {
    if (updatedUser) {
      mutate({ ...data, ...updatedUser })
    }
  }, [data, updatedUser, mutate])

  return (
    <Form action={formAction} className="max-w-[440px] mx-auto space-y-4">
      <FormField
        label="Name"
        name="name"
        type="text"
        defaultValue={data?.name}
        data-testid="name"
      />
      <FormField
        label="Email"
        name="email"
        type="email"
        defaultValue={data?.email}
        data-testid="email"
      />
      <Button disabled={pending} type="submit" variant="default">
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
    <div className="space-y-2">
      <label htmlFor={name}>{label}</label>
      <Input type={type} name={name} id={name} required {...rest} />
    </div>
  )
}
