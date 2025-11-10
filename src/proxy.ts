import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decrypt } from './lib/session'

export async function proxy(request: NextRequest) {
  const cookie = (await cookies()).get('session')?.value
  const session = await decrypt(cookie)

  /**
   * Redirect to dashboard if user is already logged in
   */
  if (request.nextUrl.pathname.startsWith('/sign-in') && session?.userId) {
    return NextResponse.redirect(new URL('/dashboard', request.nextUrl))
  }

  /**
   * Redirect to sign in if user is not signed in
   */
  if (request.nextUrl.pathname.startsWith('/dashboard') && !session?.userId) {
    return NextResponse.redirect(new URL('/sign-in', request.nextUrl))
  }

  /**
   * Redirect to reports page with current year and month
   */
  if (request.nextUrl.pathname.startsWith('/dashboard/reports')) {
    const year = request.nextUrl.searchParams.get('year')
    const month = request.nextUrl.searchParams.get('month')

    if (!year || !month) {
      const today = new Date()
      const url = new URL('/dashboard/reports', request.url)

      url.searchParams.set('year', year || today.getFullYear().toString())
      url.searchParams.set('month', month || (today.getMonth() + 1).toString())
      return NextResponse.redirect(url)
    }
  }

  if (request.nextUrl.pathname.startsWith('/api')) {
    if (
      /^\/v1\/users/.test(request.nextUrl.pathname) &&
      request.method === 'POST'
    ) {
      return NextResponse.next()
    }

    if (session?.userId) {
      const requestHeaders = new Headers(request.headers)
      const response = NextResponse.next({
        request: {
          headers: requestHeaders
        }
      })

      response.headers.set('x-user-id', session.userId as string)
      return response
    }
  }
}

export const config = {
  matcher: ['/login', '/dashboard{/:path}', '/api/(.*)']
}
