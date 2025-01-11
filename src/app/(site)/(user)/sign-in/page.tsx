import { Metadata } from 'next'
import SignInForm from '@/components/site/user/sign-in'

export const metadata: Metadata = {
  title: 'Sign In to Sumzy'
}

export default function SignIn() {
  return <SignInForm />
}