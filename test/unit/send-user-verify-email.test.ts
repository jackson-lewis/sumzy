/** @jest-environment node */
import { sendUserVerifyEmail } from '@/services/notification/user'
import { UnverifiedUser } from '@/types/user'
import { userData } from '../seeding'

const mockSendMail = jest.fn(() => {
  return Promise.resolve({})
})

jest.mock('nodemailer', () => {
  return {
    createTransport: jest.fn(() => {
      return {
        sendMail: () => mockSendMail()
      }
    })
  }
})

const user: UnverifiedUser = {
  id: 1,
  ...userData,
  verified: false,
  emailVerifyLink: 'http://localhost:3000/sign-up/verify-email?token=123'
}

describe('Send user verify email', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should send email to user', async () => {
    mockSendMail.mockResolvedValueOnce(Promise.resolve({}))
    const result = await sendUserVerifyEmail(user)

    expect(mockSendMail).toHaveBeenCalled()
    expect(result.success).toEqual(true)
  })
})
