/** @jest-environment node */
import { generateResetPasswordLink } from '@/services/user/token'
import { User } from '@prisma/client'

const user: User = {
  id: 1,
  email: 'jacksonlwss@gmail.com',
  name: 'Jackson',
  password: 'password',
  verified: false
}

describe('Generate reset password link', () => {
  it('should generate a valid reset password link', async () => {
    const result = await generateResetPasswordLink(user)
    const url = new URL(result)

    expect(url.pathname).toBe('/sign-in/forgot-password/reset')
    expect(url.searchParams.get('token')).toBeDefined()
  })
})
