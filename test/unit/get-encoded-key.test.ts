/** @jest-environment node */
import {
  fp_encodedKey,
  getEncodedKey,
  ve_encodedKey
} from '@/services/user/token'

describe('getEncodedKey', () => {
  it('should return the encoded key for reset_password', () => {
    const result = getEncodedKey('reset_password')
    expect(result).toEqual(fp_encodedKey)
  })

  it('should return the encoded key for verify_email', () => {
    const result = getEncodedKey('verify_email')
    expect(result).toEqual(ve_encodedKey)
  })
})
