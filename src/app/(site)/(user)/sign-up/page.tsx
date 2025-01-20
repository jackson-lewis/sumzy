import { Metadata } from 'next'
import SignUpForm from '@/components/site/user/sign-up'

export const metadata: Metadata = {
  title: 'Sign Up to Sumzy'
}

export default function SignUp() {
  return <SignUpForm />
}
