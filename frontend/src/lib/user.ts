import { PasswordValidationTypes } from '@/types/user'


export function validatePassword(pwd: string): {
    [k in PasswordValidationTypes]: boolean
} {
  return {
    length: pwdLength(pwd),
    uppercase: pwdContainsUppercase(pwd),
    number: pwdContainsNumber(pwd),
    special: pwdContainsSpecialChar(pwd)
  }
}

export function pwdLength(pwd: string) {
  return pwd.length >= 10
}

export function pwdContainsUppercase(pwd: string) {
  return /[A-Z]+/.test(pwd)
}

export function pwdContainsNumber(pwd: string) {
  return /[0-9]+/.test(pwd)
}

export function pwdContainsSpecialChar(pwd: string) {
  return /[^a-zA-Z0-9]+/.test(pwd)
}
