'use client'

import { type ComponentRef, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createPortal } from 'react-dom'
import Details from './details'
import styles from './style.module.scss'

export function Modal({ id }: { id: string }) {
  const router = useRouter()
  const dialogRef = useRef<ComponentRef<'dialog'>>(null)

  useEffect(() => {
    if (!dialogRef.current?.open) {
      dialogRef.current?.showModal()
    }
  }, [])

  function onClose() {
    router.back()
  }

  return createPortal(
    <dialog ref={dialogRef} className={styles.modal} onClose={onClose}>
      <Details id={id} />
      <button onClick={onClose} className={styles['close-button']} />
    </dialog>,
    document.getElementById('transaction-modal-root')!
  )
}
