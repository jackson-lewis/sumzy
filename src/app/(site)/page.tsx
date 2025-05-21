import LinkButton from '@/components/shared/button'
import SentryTestComponent from '@/components/test/sentry'
import styles from './page.module.scss'

export default function Home() {
  return (
    <main>
      <div className={styles.hero}>
        <h1>Personal Finance Tracking</h1>
        <LinkButton href="/sign-up" color="green" variant="fill">
          Sign up
        </LinkButton>
        <SentryTestComponent />
      </div>
    </main>
  )
}
