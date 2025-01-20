import { getUserToken } from '@/lib/swr'

describe('Get user token from cookies', () => {
  it('should be available', async () => {
    const token = 'jwttoken'
    jest.spyOn(document, 'cookie', 'get').mockReturnValueOnce(`token=${token};`)

    const result = getUserToken()
    expect(result).toBe(token)
  })
})
