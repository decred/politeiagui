import get from "lodash/fp/get";
import CryptoJS from "crypto-js";

export const getProposalStatus = (proposalStatus) => get(proposalStatus, [
  "Invalid",
  "Not found",
  "Not reviewed",
  "Censored",
  "Public",
]);

// This function extracts the content of index.md's payload. The payload is
// formatted as:
//
//  <proposal name>\n
//  <proposal description>
//
export const getTextFromIndexMd = file => {
  let text = atob(file.payload);
  return text.substring(text.indexOf("\n") + 1);
};

export const getHumanReadableError = (errorCode, errorContext = []) => {
  let errorMessages = [
    "The operation returned an invalid status.",
    "The provided email address or password was invalid.",
    "The provided email address is invalid.",
    "The provided user activation token is invalid.",
    "The provided user activation token is expired.",
    `The provided proposal is missing the following file(s): ${errorContext.join(", ")}`,
    "The requested proposal does not exist.",
    `The provided proposal has duplicate files: ${errorContext.join(", ")}`,
    "The provided proposal does not have a valid title.",
    "The submitted proposal has too many markdown files.",
    "The submitted proposal has too many images.",
    "The submitted proposal markdown is too large.",
    "The submitted proposal has one or more images that are too large.",
    "The provided password is invalid.",
    "The requested comment does not exist.",
    "The provided proposal name was invalid.",
    "The SHA256 checksum for one of the files was incorrect.",
    "The Base64 encoding for one of the files was incorrect.",
    `The MIME type detected for ${errorContext[0]} did not match the provided MIME type. MIME type: ${errorContext[1]}`,
    "The MIME type for one of the files is not supported.",
    "The proposal cannot be set to that status.",
    "The public key provided was invalid.",
    "No active public key was found for your account.",
    "The provided signature was invalid.",
    "The provided parameters were invalid.",
    "The private key used for signing was invalid.",
    "This comment is too long."
  ];

  if(errorCode > errorMessages.length) {
    // If the error code sent from the server is larger than the number
    // of user error codes, it's an internal error code for an internal
    // server error.
    return "The server encountered an unexpected error, please contact Politeia " +
      "administrators and include the following error code: " + errorCode;
  }

  return get(errorCode, errorMessages);
}

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
