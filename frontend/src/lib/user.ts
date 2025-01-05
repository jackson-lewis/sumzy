export function validatePassword(pwd: string) {
  return {
    length: pwdLength(pwd),
    upper: pwdContainsUppercase(pwd),
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