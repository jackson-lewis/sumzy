'use client'

import { ReactNode, useEffect, useState } from 'react'
import { useMediaQuery } from '@/hooks/use-media-query'
import { Plus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer'
import { Button } from './button'

export function ResponsiveDialog({
  title,
  formSubmitted,
  children
}: {
  title: string
  formSubmitted: boolean
  children: ReactNode
}) {
  const isMobile = useMediaQuery('(max-width: 640px)')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (formSubmitted) {
      setOpen(false)
    }
  }, [formSubmitted])

  const triggerButton = (
    <Button
      type="button"
      size="icon"
      aria-label={title}
      className="bg-transparent hover:bg-muted shadow-none border-none"
    >
      <Plus className="text-primary" />
    </Button>
  )

  const content = <div className="p-4">{children}</div>

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>{triggerButton}</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
          </DrawerHeader>
          {content}
        </DrawerContent>
      </Drawer>
    )
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">{title}</DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  )
}
