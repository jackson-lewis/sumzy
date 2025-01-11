/** @jest-environment node */
import { generateEmailVerifyLink } from '@/services/user/token'
import { User } from '@prisma/client'

const user: User = {
  id: 1,
  email: 'jacksonlwss@gmail.com',
  name: 'Jackson',
  password: 'password',
  verified: false
}

describe('Generate email verify link', () => {
  it('should generate a valid email verification link', async () => {
    const result = await generateEmailVerifyLink(user)
    const url = new URL(result)
    
    expect(url.pathname).toBe('/sign-up/verify-email')
    expect(url.searchParams.get('token')).toBeDefined()
  })
})