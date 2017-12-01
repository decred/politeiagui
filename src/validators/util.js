export function emailValidator(email) {
  return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);
}

export function arrayToRegex(arr) {
  let re = arr.reduce((acc, char) => {
    if (char === " ") char = "\\s";
    return acc + char;
  }, "");
  re = `[${re}]`;
  console.log(re);
  return new RegExp(re, "g");
}

export function proposalNameValidator(name, supportedCharacters) {
  const re = arrayToRegex(supportedCharacters);
  const matches = name.match(re);
  return matches.length === name.length;
}

export function passwordVerifyValidator(password, passwordVerify) {
  return password === passwordVerify;
}

export function isRequiredValidator(value) {
  return !!value;
}

