export function emailValidator(email) {
  return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);
}

export function arrayToRegex(arr) {
  let re = arr.reduce((acc, char) => {
    if (char === " ") char = "\\s";
    return acc + char;
  }, "");
  re = `[${re}]`;
  return new RegExp(re, "g");
}

export function proposalNameValidator(name, supportedChars) {
  const re = arrayToRegex(supportedChars);
  const matches = name.match(re);
  return matches.length === name.length;
}

export function urlValidator(text) {
  const regexp = /\[(.*?)\]\((.*?)\)/gi;
  const links = text.match(regexp);
  console.log("LINKES", links, text, regexp);
}

export function lengthValidator(str, minLength, maxLength) {
  let v = str.length >= minLength;
  if(maxLength) {
    v &= str.length <= maxLength;
  }
  return v;
}

export function passwordVerifyValidator(password, passwordVerify) {
  return password === passwordVerify;
}

export function isRequiredValidator(value) {
  return !!value;
}
