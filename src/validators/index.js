export function emailValidator(email) {
  return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);
}

export function passwordVerifyValidator(password, passwordVerify) {
  return password === passwordVerify;
}

export function isRequiredValidator(value) {
  return !!value;
}
