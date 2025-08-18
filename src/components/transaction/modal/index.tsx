'use client'

import { type ComponentRef, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
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
      className="rounded-lg shadow-lg border border-border bg-background p-0 max-w-lg w-full min-h-[200px] relative"
      onClose={onClose}
    >
      <Details id={id} />
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted-foreground transition"
        aria-label="Close"
      >
        <span className="sr-only">Close</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 4L12 12M12 4L4 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </dialog>,
    document.getElementById('transaction-modal-root')!
  )
}
