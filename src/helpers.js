import get from "lodash/fp/get";
import CryptoJS from "crypto-js";
import * as pki from "./lib/pki";
import {
  PROPOSAL_VOTING_NOT_AUTHORIZED,
  PROPOSAL_VOTING_AUTHORIZED,
  PROPOSAL_VOTING_ACTIVE,
  PROPOSAL_FILTER_ALL,
  PROPOSAL_VOTING_FINISHED,
  INVOICE_STATUS_NEW,
  INVOICE_STATUS_UPDATED,
  INVOICE_STATUS_REJECTED,
  INVOICE_STATUS_APPROVED,
  INVOICE_STATUS_PAID,
  INVOICE_STATUS_DISPUTED
} from "./constants.js";
import { INVALID_FILE } from "./constants";

export const getProposalStatus = proposalStatus =>
  get(proposalStatus, [
    "Invalid",
    "Not found",
    "Not reviewed",
    "Censored",
    "Public",
    "Unreviewed changes",
    "Abandoned",
    "Rejected",
    "Approved"
  ]);

export const utoa = str => window.btoa(unescape(encodeURIComponent(str)));
export const atou = str => decodeURIComponent(escape(window.atob(str)));

// This function extracts the content of index.md's payload. The payload is
// formatted as:
//
//  <proposal name>\n
//  <proposal description>
//
export const getTextFromIndexMd = file => {
  const text = atou(file.payload);
  return text.substring(text.indexOf("\n\n") + 1);
};

export const getTextFromJsonToCsv = file => {
  const json = JSON.parse(atou(file.payload));
  return json;
};

export const getHumanReadableError = (errorCode, errorContext = []) => {
  const genericContactMsg = "please contact Politeia administrators";
  const errorMessages = {
    0: "The operation returned an invalid status.",
    1: "The provided email address or password was invalid.",
    2: "The provided email address is invalid.",
    3: "The provided verification token is invalid. Please ensure you click the link or copy and paste it exactly as it appears in the verification email.",
    4: "The provided verification token is expired. Please register again to receive another email with a new verification token.",
    5: `The provided proposal is missing the following file(s): ${errorContext.join(
      ", "
    )}`,
    6: "The requested proposal does not exist.",
    7: `The provided proposal has duplicate files: ${errorContext.join(", ")}`,
    8: "The provided proposal does not have a valid title.",
    9: "The submitted proposal has too many markdown files.",
    10: "The submitted proposal has too many images.",
    11: "The submitted proposal markdown is too large.",
    12: "The submitted proposal has one or more images that are too large.",
    13: "The password you provided is invalid; it's either too short, too long, or has unsupported characters.",
    14: "The requested comment does not exist.",
    15: "The provided proposal name was invalid.",
    16: "The SHA256 checksum for one of the files was incorrect.",
    17: "The Base64 encoding for one of the files was incorrect.",
    18: `The MIME type detected for ${
      errorContext[0]
    } did not match the provided MIME type. MIME type: ${errorContext[1]}`,
    19: "The MIME type for one of the files is not supported.",
    20: "The proposal cannot be set to that status.",
    21: "The provided public key was invalid.",
    22: "No active public key was found for your account, please visit your account page to resolve this issue.",
    23: "The provided signature was invalid.",
    24: "The provided parameters were invalid.",
    25: "The private key used for signing was invalid.",
    26: "Your comment is too long.",
    27: "The user was not found.",
    28: `The proposal is in an unexpected state, ${genericContactMsg}.`,
    29: "You must be logged in to perform this action.",
    30: "You must pay the registration fee to perform this action.",
    31: "You cannot change the status of your own proposal, please have another admin review it!",
    32: "The username you provided is invalid; it's either too short, too long, or has unsupported characters.",
    33: "Another user already has that username, please choose another.",
    34: `A verification email has already been sent recently. Please check your email, or wait until it expires and send another one.\n\nYour verification email is set to expire on ${new Date(
      parseInt(errorContext[0] + "000", 10)
    )}. If you did not receive an email, please contact Politeia administrators.`,
    35: "The server cannot verify the payment at this time, please try again later or contact Politeia administrators.",
    36: "The public key provided is already taken by another user.",
    37: "The proposal cannot be set to that voting status.",
    38: "Your account has been locked due to too many login attempts.",
    39: "You do not have any proposal credits; you must purchase one before you can submit a proposal.",
    40: "That is an invalid user edit action.",
    41: "You are not authorized to perform this action.",
    42: "This proposal is in the wrong state for that action.",
    43: "Commenting is not allowed on this proposal.",
    44: "You cannot vote on this comment.",
    45: "You must provide a reason for censoring the proposal.",
    46: "You must provide a reason for censoring the comment.",
    47: "You cannot censor this comment.",
    48: "Only the proposal author may perform this action.",
    49: "The author has not yet authorized a vote for this proposal.",
    50: "The vote has already been authorized for this proposal.",
    51: "That is an invalid vote authorization action.",
    52: "This account has been deactivated.",
    53: "Your email address has not yet been verified.",
    54: "Invalid proposal vote parameters",
    55: "Email address is not verified",
    56: "Invalid user ID",
    57: "Invalid like comment action",
    58: "Invalid proposal censorship token",
    59: "Email address is already verified",
    60: "Malformed name",
    61: "Malformed location",
    62: "Invoice cannot be found",
    63: "Month or year was set, while the other was not",
    64: "Invalid invoice status transition",
    65: "Reason for action not provided",
    66: "Submitted invoice file is malformed",
    67: "Submitted invoice is a duplicate of an existing invoice",
    68: "Invalid payment address",
    69: "Malformed line item submitted",
    70: "Invoice missing contractor name",
    71: "Invoice missing contractor location",
    72: "Invoice missing contractor contact",
    73: "Invoice has malformed contractor contact",
    74: "Invoice missing contractor rate",
    75: "Invoice has invalid contractor rate",
    76: "Line item has malformed proposal token",
    77: "Line item has malformed domain",
    78: "Line item has malformed subdomain",
    79: "Line item has malformed description",
    80: "Invoice is an wrong status to be editted (approved, rejected or paid)",
    81: "Invoices require at least 1 line item",
    82: "Only one invoice per month/year is allowed to be submitted",
    83: "An invalid month/year was submitted on an invoice",
    84: "Exchange rate was invalid or didn't match the expected result",
    85: "The provided password was invalid"
  };

  const error = errorMessages[errorCode];
  if (!error) {
    // If the error code sent from the server cannot be translated to any error message,
    // it's an internal error code for an internal server error.
    return (
      "The server encountered an unexpected error, please contact Politeia " +
      "administrators and include the following error code: " +
      errorCode
    );
  }

  return error;
};

// Copied from https://stackoverflow.com/a/43131635
export const hexToArray = hex =>
  new Uint8Array(hex.match(/[\da-f]{2}/gi).map(h => parseInt(h, 16)));

// Copied from https://stackoverflow.com/a/21797381
export const base64ToArrayBuffer = base64 => {
  const binary_string = window.atob(base64);
  const len = binary_string.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
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
    a.push(
      (i8a[i] << 24) | (i8a[i + 1] << 16) | (i8a[i + 2] << 8) | i8a[i + 3]
    );
  }
  return CryptoJS.lib.WordArray.create(a, i8a.length);
};

export const getUsernameFieldLabel = (policy, defaultText = "Username") => {
  if (policy) {
    return `${defaultText} (${policy.minusernamelength} - ${
      policy.maxusernamelength
    } characters)`;
  }
  return defaultText;
};

export const getPasswordFieldLabel = (policy, defaultText = "Password") => {
  if (policy) {
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
  prefix +
  "_" +
  Math.random()
    .toString(36)
    .substr(2, 9);

export const verifyUserPubkey = (email, keyToBeMatched, keyMismatchAction) =>
  pki.getKeys(email).then(keys => {
    const res = keys ? keys.publicKey !== keyToBeMatched : true;
    keyMismatchAction(res);
  });

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
  return (num1 * num2) / Math.pow(10, cont1 + cont2);
};

export const isProposalApproved = vs => {
  const hasReachedQuorom =
    vs.totalvotes >= (vs.numofeligiblevotes * vs.quorumpercentage) / 100;
  const yesOption = vs.optionsresult && vs.optionsresult[1];
  const hasPassed =
    yesOption &&
    vs.totalvotes > 0 &&
    yesOption.votesreceived >= (vs.totalvotes * vs.passpercentage) / 100;
  return hasReachedQuorom && hasPassed;
};

export const countPublicProposals = proposals => {
  const defaultObj = {
    [PROPOSAL_VOTING_ACTIVE]: 0,
    [PROPOSAL_VOTING_NOT_AUTHORIZED]: 0,
    [PROPOSAL_FILTER_ALL]: 0
  };
  return proposals
    ? proposals.reduce((acc, cur) => {
        if (
          cur.status === PROPOSAL_VOTING_NOT_AUTHORIZED ||
          cur.status === PROPOSAL_VOTING_AUTHORIZED
        )
          acc[PROPOSAL_VOTING_NOT_AUTHORIZED]++;
        else if (cur.status === PROPOSAL_VOTING_ACTIVE)
          acc[PROPOSAL_VOTING_ACTIVE]++;
        else if (cur.status === PROPOSAL_VOTING_FINISHED)
          acc[PROPOSAL_VOTING_FINISHED]++;
        acc[PROPOSAL_FILTER_ALL]++;
        return acc;
      }, defaultObj)
    : defaultObj;
};

export const proposalsArrayToObject = arr =>
  arr
    ? arr.reduce((acc, cur) => {
        return {
          ...acc,
          [cur.censorshiprecord.token]: cur
        };
      }, {})
    : {};

export const removeProposalsDuplicates = (arr1, arr2) => {
  const mergedObj = {
    ...proposalsArrayToObject(arr1),
    ...proposalsArrayToObject(arr2)
  };
  return Object.keys(mergedObj).map(item => mergedObj[item]);
};

// CMS HELPERS
export const renderInvoiceStatus = status => {
  return mapInvoiceStatusToMessage[status] || "Invalid Invoice Status";
};

const mapInvoiceStatusToMessage = {
  [INVOICE_STATUS_NEW]: "Invoice unreviewed",
  [INVOICE_STATUS_UPDATED]: "Invoice updated and unreviewed",
  [INVOICE_STATUS_REJECTED]: "Invoice rejected",
  [INVOICE_STATUS_DISPUTED]: "Invoice disputed",
  [INVOICE_STATUS_APPROVED]: "Invoice approved",
  [INVOICE_STATUS_PAID]: "Invoice paid"
};

export const formatDate = date => {
  const twoChars = v => (v < 10 ? `0${v}` : v);
  const d = new Date(date * 1000);
  const year = d.getUTCFullYear();
  const month = twoChars(d.getUTCMonth());
  const day = twoChars(d.getUTCDate());
  const hours = twoChars(d.getUTCHours());
  const minutes = twoChars(d.getUTCMinutes());
  const seconds = twoChars(d.getUTCSeconds());
  return `${year}-${month}-${day}-${hours}:${minutes}:${seconds}`;
};

export const getJsonData = base64 => {
  const data = atob(base64.split(",").pop());
  try {
    const json = JSON.parse(data);
    if (!json) throw new Error(INVALID_FILE);
    return json;
  } catch (e) {
    throw new Error(INVALID_FILE);
  }
};

export const setQueryStringWithoutPageReload = qs => {
  const newurl =
    window.location.protocol +
    "//" +
    window.location.host +
    window.location.pathname +
    qs;
  window.history.pushState({ path: newurl }, "", newurl);
};

// CSV
const DELIMITER_CHAR = ",";
const COMMENT_CHAR = "#";
const LINE_DELIMITER = "\n";

export const isComment = line => line[0] === COMMENT_CHAR;

const split = (string, delimiter) => string.split(delimiter);

export const splitLine = string => split(string, LINE_DELIMITER);

export const splitColumn = string => split(string, DELIMITER_CHAR);

const jsonCsvMap = (line, linenum) => ({
  linenum,
  type: +line[0],
  subtype: line[1],
  description: line[2],
  proposaltoken: line[3],
  hours: +line[4],
  totalcost: +line[5]
});

export const csvToJson = csv =>
  splitLine(csv)
    .map(splitColumn)
    .map(jsonCsvMap);

export const getCurrentMonth = () => {
  const d = new Date();
  return d.getMonth() + 1;
};

export const getCurrentYear = () => {
  const d = new Date();
  return d.getFullYear();
};

export const fromMinutesToHours = minutes =>
  parseFloat(minutes / 60).toFixed(2);
export const fromHoursToMinutes = hours => parseInt(hours * 60, 10);
export const fromUSDCentsToUSDUnits = cents =>
  parseFloat(cents / 100).toFixed(2);
export const fromUSDUnitsToUSDCents = units => parseInt(units * 100, 10);
