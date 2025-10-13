'use client'

import { type ComponentRef, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { X } from 'lucide-react'
import { createPortal } from 'react-dom'
import Details from './details'

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
    <dialog
      ref={dialogRef}
      className="fixed inset-0 m-5 rounded-xl shadow-2xl border border-border bg-muted p-0 w-[calc(100vw-40px)] h-[calc(100vh-40px)] max-w-none max-h-none flex flex-col justify-center"
      onClose={onClose}
      style={{ padding: 0 }}
    >
      <Details id={id} />
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-9 h-9 rounded-full border border-border bg-background/80 text-foreground flex items-center justify-center shadow-lg hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none transition"
        aria-label="Close"
        type="button"
      >
        <span className="sr-only">Close</span>
        <X className="w-5 h-5" />
      </button>
    </dialog>,
    document.getElementById('transaction-modal-root')!
  )
}
