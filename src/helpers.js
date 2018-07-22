import get from "lodash/fp/get";
import CryptoJS from "crypto-js";

export const getProposalStatus = (proposalStatus) => get(proposalStatus, [
  "Invalid",
  "Not found",
  "Not reviewed",
  "Censored",
  "Public",
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
  let text = atou(file.payload);
  return text.substring(text.indexOf("\n") + 1);
};

export const getHumanReadableError = (errorCode, errorContext = []) => {
  const genericContactMsg = "please contact Politeia administrators";
  let errorMessages = [
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
    "Your account has been locked due to too many login attempts.",
    "You have not generated any instructions to purchase proposal credits yet.",
    "Your proposal payment instructions have expired, please generate new ones first.",
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
  var binary_string =  window.atob(base64);
  var len = binary_string.length;
  var bytes = new Uint8Array( len );
  for (var i = 0; i < len; i++)        {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
};

// Copied from https://stackoverflow.com/a/33918579
export const arrayBufferToWordArray = ab => {
  var i8a = new Uint8Array(ab);
  var a = [];
  for (var i = 0; i < i8a.length; i += 4) {
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
  for (var i = 0; i < 4; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};
