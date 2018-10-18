import get from "lodash/fp/get";
import CryptoJS from "crypto-js";
import * as pki from "./lib/pki";
import {
  PROPOSAL_VOTING_NOT_AUTHORIZED,
  PROPOSAL_VOTING_AUTHORIZED,
  PROPOSAL_VOTING_ACTIVE,
  PROPOSAL_FILTER_ALL,
  PROPOSAL_VOTING_FINISHED } from "./constants.js";

export const getProposalStatus = (proposalStatus) => get(proposalStatus, [
  "Invalid",
  "Not found",
  "Not reviewed",
  "Censored",
  "Public"
]);

export const utoa = (str) => window.btoa(unescape(encodeURIComponent(str)));
export const atou = (str) => decodeURIComponent(escape(window.atob(str)));

// This function extracts the content of index.md's payload. The payload is
// formatted as:
//
//  <proposal name>\n
//  <proposal description>
//
export const getTextFromIndexMd = file => {
  const text = atou(file.payload);
  return text.substring(text.indexOf("\n") + 1);
};

export const getHumanReadableError = (errorCode, errorContext = []) => {
  const genericContactMsg = "please contact Politeia administrators";
  const errorMessages = [
    "The operation returned an invalid status.",
    "The provided email address or password was invalid.",
    "The provided email address is invalid.",
    "The provided verification token is invalid. Please ensure you click the link or copy and paste it exactly as it appears in the verification email.",
    "The provided verification token is expired. Please register again to receive another email with a new verification token.",
    `The provided proposal is missing the following file(s): ${errorContext.join(", ")}`,
    "The requested proposal does not exist.",
    `The provided proposal has duplicate files: ${errorContext.join(", ")}`,
    "The provided proposal does not have a valid title.",
    "The submitted proposal has too many markdown files.",
    "The submitted proposal has too many images.",
    "The submitted proposal markdown is too large.",
    "The submitted proposal has one or more images that are too large.",
    "The password you provided is invalid; it's either too short, too long, or has unsupported characters.",
    "The requested comment does not exist.",
    "The provided proposal name was invalid.",
    "The SHA256 checksum for one of the files was incorrect.",
    "The Base64 encoding for one of the files was incorrect.",
    `The MIME type detected for ${errorContext[0]} did not match the provided MIME type. MIME type: ${errorContext[1]}`,
    "The MIME type for one of the files is not supported.",
    "The proposal cannot be set to that status.",
    "The provided public key was invalid.",
    "No active public key was found for your account, please visit your account page to resolve this issue.",
    "The provided signature was invalid.",
    "The provided parameters were invalid.",
    "The private key used for signing was invalid.",
    "Your comment is too long.",
    "The user was not found.",
    `The proposal is in an unexpected state, ${genericContactMsg}.`,
    "You must be logged in to perform this action.",
    "You must pay the registration fee to perform this action.",
    "You cannot change the status of your own proposal, please have another admin review it!",
    "The username you provided is invalid; it's either too short, too long, or has unsupported characters.",
    "Another user already has that username, please choose another.",
    `A verification email has already been sent recently. Please check your email, or wait until it expires and send another one.\n\nYour verification email is set to expire on ${new Date(parseInt(errorContext[0] + "000", 10))}. If you did not receive an email, please contact Politeia administrators.`,
    "The server cannot verify the payment at this time, please try again later or contact Politeia administrators.",
    "The public key provided is already taken by another user.",
    "The proposal cannot be set to that voting status.",
    "Your account has been locked, most likely due to too many failed login attempts.",
    "You do not have any proposal credits; you must purchase one before you can submit a proposal."
  ];

  if(errorCode > errorMessages.length) {
    // If the error code sent from the server is larger than the number
    // of user error codes, it's an internal error code for an internal
    // server error.
    return "The server encountered an unexpected error, please contact Politeia " +
      "administrators and include the following error code: " + errorCode;
  }

  return get(errorCode, errorMessages);
};

// Copied from https://stackoverflow.com/a/43131635
export const hexToArray = hex => (new Uint8Array(hex.match(/[\da-f]{2}/gi).map(h => parseInt(h, 16))));

// Copied from https://stackoverflow.com/a/21797381
export const base64ToArrayBuffer = base64 => {
  const binary_string =  window.atob(base64);
  const len = binary_string.length;
  const bytes = new Uint8Array( len );
  for (let i = 0; i < len; i++)        {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
};

// Copied from https://stackoverflow.com/a/33918579
export const arrayBufferToWordArray = ab => {
  const i8a = new Uint8Array(ab);
  const a = [];
  for (let i = 0; i < i8a.length; i += 4) {
    // eslint-disable-next-line
    a.push(i8a[i] << 24 | i8a[i + 1] << 16 | i8a[i + 2] << 8 | i8a[i + 3]);
  }
  return CryptoJS.lib.WordArray.create(a, i8a.length);
};

export const getUsernameFieldLabel = (policy, defaultText = "Username") => {
  if(policy) {
    return `${defaultText} (${policy.minusernamelength} - ${policy.maxusernamelength} characters)`;
  }
  return defaultText;
};

export const getPasswordFieldLabel = (policy, defaultText = "Password") => {
  if(policy) {
    return `${defaultText} (at least ${policy.minpasswordlength} characters)`;
  }
  return defaultText;
};

export const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#3F";
  for (let i = 0; i < 4; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export const uniqueID = prefix =>
  prefix + "_" + Math.random().toString(36).substr(2, 9);

export const verifyUserPubkey = (email, keyToBeMatched, keyMismatchAction) =>
  pki
    .getKeys(email)
    .then(keys =>
      keyMismatchAction(
        keys.publicKey !== keyToBeMatched
      )
    );

export const multiplyFloatingNumbers = (num1, num2) => {
  let cont1 = 0;
  let cont2 = 0;
  while (num1 < 1) {
    num1 *= 10;
    cont1++;
  }
  while (num2 < 1) {
    num2 *= 10;
    cont2++;
  }
  return (num1*num2)/(Math.pow(10, cont1+cont2));
};

export const countPublicProposals = (proposals) => {
  const defaultObj = {
    [PROPOSAL_VOTING_ACTIVE]: 0,
    [PROPOSAL_VOTING_NOT_AUTHORIZED]: 0,
    [PROPOSAL_VOTING_FINISHED]: 0,
    [PROPOSAL_FILTER_ALL]: 0
  };
  return proposals ? proposals.reduce((acc, cur) => {
    if(cur.status === PROPOSAL_VOTING_NOT_AUTHORIZED ||
      cur.status === PROPOSAL_VOTING_AUTHORIZED)
      acc[PROPOSAL_VOTING_NOT_AUTHORIZED]++;
    else if(cur.status === PROPOSAL_VOTING_ACTIVE)
      acc[PROPOSAL_VOTING_ACTIVE]++;
    else if(cur.status === PROPOSAL_VOTING_FINISHED)
      acc[PROPOSAL_VOTING_FINISHED]++;
    acc[PROPOSAL_FILTER_ALL]++;
    return acc;
  }, defaultObj) : defaultObj;
};

export const proposalsArrayToObject = arr =>
  arr ? arr.reduce((acc, cur) => {
    return {
      ...acc,
      [cur.censorshiprecord.token]: cur
    };
  }, {}) : {};

export const removeProposalsDuplicates = (arr1, arr2) => {
  const mergedObj = {
    ...proposalsArrayToObject(arr1),
    ...proposalsArrayToObject(arr2)
  };
  return Object.keys(mergedObj).map(item => mergedObj[item]);
};

export const exportToCsv = (data, fields) => {
  const csvContent = data.reduce((acc, info) => {
    let row = "";
    fields.forEach(f => row += `"${info[f]}",`);
    return acc + row + "\n";
  }, "");
  const titles = fields.reduce((acc, f) => acc + `"${f}",`, "");
  const csv = "data:text/csv;charset=utf-8," + titles + "\n" + csvContent;
  const content = encodeURI(csv);
  const link = document.createElement("a");
  link.setAttribute("href", content);
  link.setAttribute("download", "payment_history");
  link.click();
};

export const formatDate = (date) => {
  const d = new Date(date * 1000);
  const day = d.getUTCDate();
  const year = d.getUTCFullYear();
  const month = d.getUTCMonth();
  const _minutes = d.getUTCMinutes();
  const minutes = _minutes < 10 ? `0${_minutes}` : _minutes;
  const time = d.getUTCHours() + ":" + minutes;
  return year + "-" + month + "-" + day + "  |  " + time;
};
