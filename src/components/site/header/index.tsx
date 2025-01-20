import Image from 'next/image'
import Link from 'next/link'
import LinkButton from '@/components/shared/button'
import styles from './style.module.scss'

export default function Header() {
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logolink}>
        <Image
          src="/sumzy.svg"
          alt="Sumzy logo"
          width={40}
          height={40}
          priority
        />
        <span>sumzy</span>
      </Link>
      <LinkButton href="/sign-in">Sign in</LinkButton>
    </header>
  )
}
