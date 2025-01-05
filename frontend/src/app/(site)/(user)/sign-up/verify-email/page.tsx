import { Metadata } from 'next'
import VerifyMessage from '@/components/site/user/verify'

export const metadata: Metadata = {
  title: 'Verify your email ~ Sumzy',
  robots: 'noindex, nofollow'
}

export default function SignUpVerify() {
  return <VerifyMessage />
}