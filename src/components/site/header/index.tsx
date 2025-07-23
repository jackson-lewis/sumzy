import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Header() {
  return (
    <header className="px-5 py-2.5 flex justify-between">
      <Link href="/" className="flex gap-2 items-center text-2xl">
        <Image
          src="/sumzy.svg"
          alt="Sumzy logo"
          width={40}
          height={40}
          priority
        />
        <span>sumzy</span>
      </Link>
      <Button asChild>
        <Link href="/sign-in">Sign in</Link>
      </Button>
    </header>
  )
}
