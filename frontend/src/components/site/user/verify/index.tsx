'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import LoadingIcon from '@/components/shared/loading-icon'
import { Container } from '../form'
import { verifyEmailToken } from '@/lib/actions/user'

export default function VerifyMessage() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    async function verifyEmail() {
      if (!token) {
        return
      }
      const errorMessage = await verifyEmailToken(token)
      if (errorMessage) {
        setErrorMessage(errorMessage)
      }
    }
    verifyEmail()
  }, [token])

  return (
    <Container>
      {token ? (
        <>
          {errorMessage ? (
            <>
              <h1>Expired</h1>
              <p>Sorry, this link has now expired. Get a new verification link here.</p>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm0-160q17 0 28.5-11.5T520-480v-160q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640v160q0 17 11.5 28.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
            </>
          ) : (
            <>
              <h1>Verifying your email</h1>
              <p>Please wait while we verify your email, it&apos;ll only take a moment.</p>
              <LoadingIcon />
            </>
          )}
        </>
      ) : (
        <>
          <h1>Verify your email</h1>
          <p>
            We&apos;ve sent you an email with a link to verify your email address. Click the link in the email to verify your email address.
          </p>
        </>
      )}
    </Container>
  )
}