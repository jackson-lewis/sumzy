/** @jest-environment node */
import { sendUserVerifyEmail } from '@/services/notification/user'
import { UnverifiedUser } from '@/types/user'

const user: UnverifiedUser = {
  id: 1,
  email: 'jacksonlwss@gmail.com',
  name: 'Jackson',
  password: 'password',
  verified: false,
  emailVerifyLink: 'http://localhost:3000/sign-up/verify-email?token=123'
}

describe('Send user verify email', () => {
  it('should send email to user', async () => {
    const result = await sendUserVerifyEmail(user)

    expect(result.response).toContain('250')
  })
})