import {
  pwdContainsNumber,
  pwdContainsSpecialChar,
  pwdContainsUppercase,
  pwdLength,
  validatePassword
} from '@/lib/user'

describe('Validate password length', () => {
  it('should return true for password 10 chars in length', async () => {
    const password = 'passworddd'
    const valid = pwdLength(password)

    expect(valid).toBe(true)
  })

  it('should return false for password 8 chars in length', async () => {
    const password = 'password'
    const valid = pwdLength(password)

    expect(valid).toBe(false)
  })
})

describe('Validate password contains uppercase', () => {
  it('should return true when contains uppercase char', async () => {
    const password = 'Password'
    const valid = pwdContainsUppercase(password)

    expect(valid).toBe(true)
  })

  it('should return false when contains no uppercase char', async () => {
    const password = 'password'
    const valid = pwdContainsUppercase(password)

    expect(valid).toBe(false)
  })
})

describe('Validate password contains number', () => {
  it('should return true when contains number char', async () => {
    const password = 'password1'
    const valid = pwdContainsNumber(password)

    expect(valid).toBe(true)
  })

  it('should return false when contains no number char', async () => {
    const password = 'password'
    const valid = pwdContainsNumber(password)

    expect(valid).toBe(false)
  })
})

describe('Validate password contains special char', () => {
  it('should return true when contains special char', async () => {
    const password = 'password!'
    const valid = pwdContainsSpecialChar(password)

    expect(valid).toBe(true)
  })

  it('should return false when contains no special char', async () => {
    const password = 'password'
    const valid = pwdContainsSpecialChar(password)

    expect(valid).toBe(false)
  })
})

describe('Validate password', () => {
  it('should return true when password is valid', async () => {
    const password = 'Password1!'
    const valid = validatePassword(password)

    expect(valid).toStrictEqual({
      length: true,
      upper: true,
      number: true,
      special: true
    })
  })

  it('should return false when password not of length', async () => {
    const password = 'Passwor1!'
    const valid = validatePassword(password)

    expect(valid).toStrictEqual({
      length: false,
      upper: true,
      number: true,
      special: true
    })
  })

  it('should return false when password contains no uppercase', async () => {
    const password = 'password1!'
    const valid = validatePassword(password)

    expect(valid).toStrictEqual({
      length: true,
      upper: false,
      number: true,
      special: true
    })
  })

  it('should return false when password contains no number', async () => {
    const password = 'Password!!'
    const valid = validatePassword(password)

    expect(valid).toStrictEqual({
      length: true,
      upper: true,
      number: false,
      special: true
    })
  })

  it('should return false when password contains no special char', async () => {
    const password = 'Password11'
    const valid = validatePassword(password)

    expect(valid).toStrictEqual({
      length: true,
      upper: true,
      number: true,
      special: false
    })
  })

  it('should return false when password fails all validations', async () => {
    const password = 'pass'
    const valid = validatePassword(password)

    expect(valid).toStrictEqual({
      length: false,
      upper: false,
      number: false,
      special: false
    })
  })
})
