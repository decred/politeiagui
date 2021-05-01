import CryptoJS from "crypto-js";
import get from "lodash/fp/get";
import flow from "lodash/fp/flow";
import filter from "lodash/fp/filter";
import gte from "lodash/fp/gt";
import range from "lodash/fp/range";
import map from "lodash/fp/map";
import splitFp from "lodash/fp/split";
import reduce from "lodash/fp/reduce";
import compose from "lodash/fp/compose";
import * as pki from "./lib/pki";
import { sha3_256 } from "js-sha3";
import { capitalize } from "./utils/strings";

import {
  INVALID_FILE,
  INVOICE_STATUS_APPROVED,
  INVOICE_STATUS_DISPUTED,
  INVOICE_STATUS_NEW,
  INVOICE_STATUS_PAID,
  INVOICE_STATUS_REJECTED,
  INVOICE_STATUS_UPDATED,
  PROPOSAL_FILTER_ALL,
  PROPOSAL_VOTING_ACTIVE,
  PROPOSAL_VOTING_AUTHORIZED,
  PROPOSAL_VOTING_FINISHED,
  PROPOSAL_VOTING_NOT_AUTHORIZED,
  PROPOSAL_METADATA_FILENAME,
  PROPOSAL_STATUS_PUBLIC,
  PROPOSAL_STATUS_CENSORED,
  PROPOSAL_STATUS_ARCHIVED,
  VOTE_METADATA_FILENAME,
  USER_METADATA_PLUGIN
} from "./constants.js";

// XXX find usage and ensure this still works as expected
export const getProposalStatus = (proposalStatus) =>
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

export const digestPayload = (payload) =>
  CryptoJS.SHA256(
    arrayBufferToWordArray(base64ToArrayBuffer(payload))
  ).toString(CryptoJS.enc.Hex);

export const digest = (payload) => sha3_256(payload);

export const utoa = (str) => window.btoa(unescape(encodeURIComponent(str)));
export const atou = (str) => decodeURIComponent(escape(window.atob(str)));

// parseReceivedProposalsMap iterates over BE returned proposals map[token] => proposal, parses the
// metadata file & the proposal statuses
export const parseReceivedProposalsMap = (proposals) => {
  const parsedProps = {};
  for (const [token, prop] of Object.entries(proposals)) {
    parsedProps[token] = parseRawProposal(prop);
  }
  return parsedProps;
};

// parseProposalStatuses iterate over proposal's status changes array returned
// from BE and returns proposal's timestamps accordingly
const parseProposalStatuses = (sChanges) => {
  let publishedat = 0,
    censoredat = 0,
    abandonedat = 0;

  sChanges.forEach((sChange) => {
    if (sChange.status === PROPOSAL_STATUS_PUBLIC) {
      publishedat = sChange.timestamp;
    }
    if (sChange.status === PROPOSAL_STATUS_CENSORED) {
      censoredat = sChange.timestamp;
    }
    if (sChange.status === PROPOSAL_STATUS_ARCHIVED) {
      abandonedat = sChange.timestamp;
    }
  });
  return { publishedat, censoredat, abandonedat };
};

// parseProposalMetadata accepts a proposal object parses it's metadata
// and returns it as object of the form { name }
//
// censored proposals won't have metadata, in this case this function will
// return an empty object
const parseProposalMetadata = (proposal = {}) => {
  const metadata =
    proposal.files &&
    proposal.files.find((f) => f.name === PROPOSAL_METADATA_FILENAME);
  return metadata ? JSON.parse(atob(metadata.payload)) : {};
};

// parseVoteMetadata accepts a proposal object parses it's metadata
// and returns it as object of the form { linkto, linkby }
//
// censored proposals won't have metadata, in this case this function will
// return an empty object
const parseVoteMetadata = (proposal = {}) => {
  const metadata =
    proposal.files &&
    proposal.files.find((f) => f.name === VOTE_METADATA_FILENAME);
  return metadata ? JSON.parse(atob(metadata.payload)) : {};
};

// parseUserMetadata accepts a proposal object parses it's metadata
// and returns it as object of the form { userid, token }
//
// proposals without any user metadata will return an empty object
const parseUserPluginMetadata = (proposal = {}) =>
  compose(
    reduce((acc, curr) => ({ ...acc, ...curr }), {}),
    map(({ payload }) => {
      try {
        const parsedPayload = JSON.parse(payload);
        return parsedPayload;
      } catch (e) {
        // parses metadata payload manually
        return compose(
          map((parsed) => JSON.parse(`{${parsed}}`)),
          splitFp(/\{(.*?)\}/)
        )(payload);
      }
    }),
    filter(({ pluginid }) => pluginid === USER_METADATA_PLUGIN),
    get("metadata")
  )(proposal);

// parseProposalIndexFile accepts a proposal object parses it's metadata
// and returns it as object of the form { description }
//
// censored proposals won't have metadata, in this case this function will
// return an empty object
const parseProposalIndexFile = (proposal = {}) => {
  const index =
    proposal.files && proposal.files.find((f) => f.name === "index.md");
  return index ? { description: getTextFromIndexMd(index) } : {};
};

// parseRawProposal accepts raw proposal object received from BE and parses
// it's metadata & status changes
export const parseRawProposal = (proposal) => {
  // Parse statuses
  const { publishedat, censoredat, abandonedat } = parseProposalStatuses(
    proposal.statuses || []
  );
  // Parse metdata
  // Censored proposal's metadata isn't available
  const { name } = parseProposalMetadata(proposal);
  const { linkby, linkto } = parseVoteMetadata(proposal);
  const { description } = parseProposalIndexFile(proposal);
  const { userid } = parseUserPluginMetadata(proposal);
  return {
    ...proposal,
    description: description || proposal.description,
    name: name || proposal.name,
    linkby,
    userid: userid || proposal.userid,
    linkto,
    publishedat,
    commentsCount: proposal.commentsCount || 0,
    censoredat,
    abandonedat
  };
};

// parseRawProposalsBatch accepts raw proposal batch object received from BE and parses
// the respective metadata & status changes for each proposal
export const parseRawProposalsBatch = (proposals) =>
  Object.keys(proposals).reduce(
    (acc, curr) => ({
      ...acc,
      [curr]: parseRawProposal(proposals[curr])
    }),
    {}
  );

// This function extracts the content of index.md's payload which includes the
// propsoal description.
export const getTextFromIndexMd = (file = {}) => {
  if (!file.payload) return "";
  return atou(file.payload);
};

export const getIndexMdFromText = (text = "") => ({
  name: "index.md",
  mime: "text/plain; charset=utf-8",
  payload: utoa(text)
});

export const getTextFromJsonToCsv = (file) => {
  const json = JSON.parse(atou(file.payload));
  return json;
};

export const getHumanReadableError = (errorCode, errorContext = []) => {
  const genericContactMsg = "please contact Politeia administrators";
  const errorMessages = {
    0: "The operation returned an invalid status.",
    1: "The provided password was invalid.",
    2: "The provided email address is invalid.",
    3: "The provided verification token is invalid. Please ensure you click the link or copy and paste it exactly as it appears in the verification email.",
    4: "The provided verification token is expired. Please register again to receive another email with a new verification token.",
    5: `The provided proposal is missing the following file(s): ${errorContext}`,
    6: "The requested proposal does not exist.",
    7: `The provided proposal has duplicate files: ${errorContext}`,
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
    18: `The MIME type detected for ${errorContext} is not supported.`,
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
      parseInt(errorContext + "000", 10)
    )}. If you did not receive an email, please contact Politeia administrators.`,
    35: "The server cannot verify the payment at this time, please try again later or contact Politeia administrators.",
    36: "The public key provided is already taken by another user.",
    37: "The proposal cannot be set to that voting status.",
    38: "Your account has been locked due to too many login attempts.",
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
    54: "Invalid proposal vote parameters.",
    55: "Email address is not verified.",
    56: "Invalid user ID.",
    57: "Invalid like comment action.",
    58: "Invalid proposal censorship token.",
    59: "Email address is already verified.",
    60: "No changes were found in the proposal.",
    61: "Maximum proposal page size exceeded.",
    62: "That is a duplicate comment.",
    63: "Invalid login credentials",
    64: "Comment is censored",
    65: "Invalid proposal version",
    66: "Invalid proposal metadata",
    67: "Missing proposal metadata",
    68: "Proposal metadata digest invalid",
    69: "Invalid vote type",
    70: "Invalid vote option",
    71: "Linkby not met yet",
    72: "No linked proposals",
    73: `Invalid propsoal linkto. ${errorContext}`,
    74: `Invalid proposal linkby. ${errorContext}`,
    75: `Invalid runoff vote. ${errorContext}`,
    76: `Wrong proposal type. ${errorContext}`,
    77: "The provided code does not match the saved key",
    78: "Invalid TOTP Type",
    79: "User has verified TOTP secret and login requires code.",
    80: "Must wait until next TOTP code window before another login attempt.",
    88: "User cannot vote on his own comment",
    101: "You do not have any proposal credits; you must purchase one before you can submit a proposal.",

    // CMS Errors
    1001: "Malformed name",
    1002: "Malformed location",
    1003: "Invoice cannot be found",
    1004: "Month or year was set, while the other was not",
    1005: "Invalid invoice status transition",
    1006: "Reason for action not provided",
    1007: "Submitted invoice file is malformed",
    1008: "Submitted invoice is a duplicate of an existing invoice",
    1009: "Invalid payment address",
    1010: "Malformed line item submitted",
    1011: "Invoice missing contractor name",
    1013: "Invoice missing contractor contact",
    1014: "Invoice missing contractor rate",
    1015: "Invoice has invalid contractor rate",
    1016: "Invoice has malformed contractor contact",
    1017: "Line item has malformed proposal token",
    1018: "Line item has malformed domain",
    1019: "Line item has malformed subdomain",
    1020: "Line item has malformed description",
    1021: "Invoice is an wrong status to be editted (approved, rejected or paid)",
    1022: "Invoices require at least 1 line item",
    1023: "Only one invoice per month/year is allowed to be submitted",
    1024: "An invalid month/year was submitted on an invoice",
    1025: "Exchange rate was invalid or didn't match the expected result",
    1026: "An invalid line item type was entered.",
    1027: "An invalid value was entered into labor or expenses.",
    1028: "The invoice has a duplicate payment address, please use a new address.",
    1029: "Invalid dates were requested for line item payouts.",
    1030: "An attempted edit of invoice included an unauthorized month or year change.",
    1031: "An invalid DCC Type was included in the request.",
    1032: "Your domain does not match the DCC domain.",
    1033: "The DCC sponsor statement is malformed.",
    1034: "The submitted DCC file is malformed, please review and try again.",
    1035: "This error is currently not implemented.",
    1036: "There was an invalid status transition detected.",
    1037: "That email is already being used by another user.",
    1038: "You do not have the correct contractor status to submit an invoice.",
    1039: "An invalid nominee was submitted for a DCC.",
    1040: "The requested DCC was not found.",
    1041: "Cannot comment/support/oppose a DCC if it's not active.",
    1042: "Invalid suppport or opposition vote was included, must be aye or nay.",
    1043: "You have already supported or opposed this DCC.",
    1044: "You may not support or oppose your own sponsored DCC.",
    1045: "You are not authorized to complete a DCC request.",
    1046: "You must include a valid contractor type for a DCC.",
    1047: "You must be a Supervisor Contractor to submit a Sub Contractor line item",
    1048: "You must supply a UserID for a Sub Contractor line item",
    1049: "Invalid SubContractor",
    1050: `Supervisor Error - ${errorContext}`
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

export const objectToBuffer = (obj) => Buffer.from(JSON.stringify(obj));

export const bufferToBase64String = (buf) => buf.toString("base64");

export const objectToSHA256 = (obj) => {
  const buffer = objectToBuffer(obj);
  const base64 = bufferToBase64String(buffer);
  return digestPayload(base64);
};

// Copied from https://stackoverflow.com/a/43131635
export const hexToArray = (hex) =>
  new Uint8Array(hex.match(/[\da-f]{2}/gi).map((h) => parseInt(h, 16)));

// Copied from https://stackoverflow.com/a/21797381
export const base64ToArrayBuffer = (base64) => {
  const binary_string = window.atob(base64);
  const len = binary_string.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
};

// Copied from https://stackoverflow.com/a/33918579
export const arrayBufferToWordArray = (ab) => {
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
    return `${defaultText} (${policy.minusernamelength} - ${policy.maxusernamelength} characters)`;
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

export const uniqueID = (prefix) =>
  prefix + "_" + Math.random().toString(36).substr(2, 9);

export const verifyUserPubkey = (userid, keyToBeMatched, keyMismatchAction) =>
  pki.getKeys(userid).then((keys) => {
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

export const countPublicProposals = (proposals) => {
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

export const proposalsArrayToObject = (arr) =>
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
  return Object.keys(mergedObj).map((item) => mergedObj[item]);
};

export const getKeyByValue = (obj, val) =>
  Object.values(obj).find((value) => value.digest === val);

// CMS HELPERS
export const renderInvoiceStatus = (status) => {
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

export const formatDate = (date) => {
  const twoChars = (v) => (v < 10 ? `0${v}` : v);
  const d = new Date(date * 1000);
  const year = d.getUTCFullYear();
  const month = twoChars(d.getUTCMonth());
  const day = twoChars(d.getUTCDate());
  const hours = twoChars(d.getUTCHours());
  const minutes = twoChars(d.getUTCMinutes());
  const seconds = twoChars(d.getUTCSeconds());
  return `${year}-${month}-${day}-${hours}:${minutes}:${seconds}`;
};

export const getJsonData = (base64) => {
  const data = atob(base64.split(",").pop());
  try {
    const json = JSON.parse(data);
    if (!json) throw new Error(INVALID_FILE);
    return json;
  } catch (e) {
    throw new Error(INVALID_FILE);
  }
};

// CSV
const DELIMITER_CHAR = ",";
const COMMENT_CHAR = "#";
const LINE_DELIMITER = "\n";

export const isComment = (line) => line[0] === COMMENT_CHAR;

const split = (string, delimiter) => string.split(delimiter);

export const splitLine = (string) => split(string, LINE_DELIMITER);

export const splitColumn = (string) => split(string, DELIMITER_CHAR);

const jsonCsvMap = (line, linenum) => ({
  linenum,
  type: +line[0],
  subtype: line[1],
  description: line[2],
  proposaltoken: line[3],
  hours: +line[4],
  totalcost: +line[5]
});

export const csvToJson = (csv) =>
  splitLine(csv).map(splitColumn).map(jsonCsvMap);

export const getMonthOptions = () => {
  const month = getCurrentMonth();
  return flow(range(), filter(gte(month)))(1, 13);
};

export const getCurrentMonth = () => {
  const d = new Date();
  return d.getMonth() + 1;
};

export const getCurrentYear = () => {
  const d = new Date();
  return d.getFullYear();
};

export const getCurrentDateValue = () => {
  return {
    month: getCurrentMonth(),
    year: getCurrentYear()
  };
};

export const getDateFromYearAndMonth = ({ year, month }) =>
  new Date(year, month);

export const getYearOptions = (initial, lastYear) => {
  const isYearValid = (y) => y < lastYear + getCurrentMonth() - 1;
  return flow(range(), filter(isYearValid))(initial, lastYear + 1);
};

export const fromMinutesToHours = (minutes) =>
  parseFloat(minutes / 60).toFixed(2);
export const fromHoursToMinutes = (hours) => parseInt(hours * 60, 10);
export const fromUSDCentsToUSDUnits = (cents) =>
  parseFloat(cents / 100).toFixed(2);
export const fromUSDUnitsToUSDCents = (units) => parseInt(units * 100, 10);

export const isEmpty = (obj) => Object.keys(obj).length === 0;

/** Pure function that given 2 UNIX timestamps returns the differnce between them in minutes */
export const getTimeDiffInMinutes = (d1, d2) => {
  return (d1 - d2) / 60e3;
};

/**
 * Function to format supported domains in the format for Select/Dropdown
 * components
 * @param {array} supporteddomains
 */
export const getContractorDomains = (supporteddomains) => [
  { label: "No domain defined", value: 0 },
  ...supporteddomains.map((item) => ({
    label: capitalize(item.description),
    value: item.type
  }))
];

/**
 * Function to return the domain name given an array of contractor domains and
 * a domain type
 * @param {array} contractorDomains
 * @param {number|string} op
 */
export const getDomainName = (contractorDomains, op) => {
  const domain = contractorDomains.find((domain) => domain.value === op);
  return domain ? domain.label : "";
};

/**
 * Converts { day, month, year } object to unix second timestamp
 * uses 23:59 of that day as time.
 * @param {object} date
 */
export const convertObjectToUnixTimestamp = ({ day, month, year }) =>
  new Date(Date.UTC(year, month - 1, day, 23, 59)).getTime() / 1000;
/** INLINE IMAGES HELPERS */
/**
 * replaceBlobsByDigestsAndGetFiles uses a regex to parse images and replace blobs by files digests
 * @param {String} description the markdown description
 * @param {Map} map the map of blob -> file
 * @returns {object} { description, files }
 */
export function replaceBlobsByDigestsAndGetFiles(description, map) {
  const imageRegexParser = /!\[[^\]]*\]\((?<blob>.*?)(?="|\))(?<optionalpart>".*")?\)/g;
  const imgs = description.matchAll(imageRegexParser);
  let newDescription = description;
  const files = [];
  /**
   * This for loop will update the newDescription replacing the image blobs by their digests and push the img object to an array of files
   * */
  for (const img of imgs) {
    const { blob } = img.groups;
    if (map.has(blob)) {
      newDescription = newDescription.replace(blob, map.get(blob).digest);
      files.push(map.get(blob));
    }
  }
  return { description: newDescription, files };
}

const b64toBlob = (b64Data, contentType = "", sliceSize = 512) => {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: contentType });
  return blob;
};

/**
 * replaceBlobsByDigestsAndGetFiles uses a regex to parse images digests and create a new Blob
 * @param {String} description the markdown description
 * @param {Map} map the map of blob -> file
 * @returns {object} { description, files }
 */
export function replaceImgDigestByBlob(vals, map) {
  if (!vals) return { text: "", markdownFiles: [] };
  const { description, files } = vals;
  const imageRegexParser = /!\[[^\]]*\]\((?<digest>.*?)(?="|\))(?<optionalpart>".*")?\)/g;
  const imgs = description.matchAll(imageRegexParser);
  let newText = description;
  const markdownFiles = [];
  /**
   * This for loop will update the newText replacing images digest by a blob and push the img object to an array of markdownFiles
   * */
  for (const img of imgs) {
    const { digest } = img.groups;
    const obj = getKeyByValue(files, digest);
    if (obj) {
      const urlCreator = window.URL || window.webkitURL;
      const blobUrl = urlCreator.createObjectURL(
        b64toBlob(obj.payload, obj.mime)
      );
      map.set(blobUrl, obj);
      markdownFiles.push(obj);
      newText = newText.replace(digest, blobUrl);
    }
  }
  return { text: newText, markdownFiles };
}

/**
 * getAttachmentsFiles removes the metadata and index files
 * @param {Array} files
 * @returns {Array} [attachments]
 */
export function getAttachmentsFiles(files) {
  return files.filter(
    (f) =>
      ![
        "index.md",
        "data.json",
        PROPOSAL_METADATA_FILENAME,
        VOTE_METADATA_FILENAME
      ].includes(f.name)
  );
}
