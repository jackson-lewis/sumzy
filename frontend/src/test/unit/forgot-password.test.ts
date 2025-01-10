/** @jest-environment node */
import { forgotPassword } from '@/lib/actions/user'


jest.mock('next/headers', () => ({
  ...jest.requireActual('next/headers'),
  __esModule: true,
  cookies: jest.fn(() => {
    return Promise.resolve({
      get: () => {
        return {
          value: 'sessionvalue'
        }
      }
    })
  })
}))

describe('Forgot password', () => {
  it('should return success message when request is successful', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ success: true })
      })
    ) as jest.Mock

    const data = new FormData()
    data.append('email', 'jackson@sumzy.money')

    const message = await forgotPassword(undefined, data)
    const successMessage = 'A reset password link has been sent to your email'

    expect(message).toBe(successMessage)
  })

  it('should return error message when request failed', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        status: 400,
        json: () => Promise.resolve(new Error('Something went wrong'))
      })
    ) as jest.Mock

    const data = new FormData()
    data.append('email', 'jackson@sumzy.money')

    const message = await forgotPassword(undefined, data)
    const errorMessage = 'Something went wrong'

    expect(message).toBe(errorMessage)
  })
})