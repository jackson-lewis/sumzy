import { Modal } from '@/components/transaction/modal'

export default async function EditTransaction({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const id = (await params).id

  return <Modal id={id} />
}
