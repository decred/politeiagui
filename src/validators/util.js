import { SubmissionError } from "redux-form";

export function emailValidator(email) {
  return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,24}$/i.test(email);
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

export const validateURL = text => {
  const validUrl = urlValidator(text);
  if (validUrl.error) {
    throw new SubmissionError({
      _error: `The link "${
        validUrl.url
      }" is invalid. Make sure that it is a valid URL.`
    });
  }
};

export function urlValidator(text) {
  const regexp = /\[([^\][]*?)\]([ ]*)\((.*?)\)/gi;
  const urlArray = text.match(regexp);
  if (!urlArray) {
    return { error: false };
  }
  for (const urlMarkdown of urlArray) {
    let url = urlMarkdown.match(/\(([^()]*)\)/gi)[0];
    url = url.slice(1, url.length - 1);
    try {
      new URL(url);
      const link = document.createElement("a");
      link.href = url;
      if (!link.hostname) {
        return { url: url, error: true };
      }
    } catch (error) {
      return { url: url, error: true };
    }
  }
  return { error: false };
}

export function lengthValidator(str, minLength, maxLength) {
  let v = str.length >= minLength;
  if (maxLength) {
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
