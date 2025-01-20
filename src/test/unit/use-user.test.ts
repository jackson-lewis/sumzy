import { User } from '@/types'
import { renderHook } from '@testing-library/react'
import { useUser } from '@/lib/swr'

const user: User = {
  name: 'John',
  email: 'john@sumzy.money'
}

jest.mock('swr', () => ({
  ...jest.requireActual('swr'),
  __esModule: true,
  default: jest.fn(() => {
    return {
      data: user,
      error: undefined,
      loading: false
    }
  })
}))

describe('Get user with useUser hook', () => {
  it('should get user data', async () => {
    const { result } = renderHook(useUser)

    expect(result.current.data).toStrictEqual(user)
  })
})
