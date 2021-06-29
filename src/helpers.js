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

// shortToken receives a full lengthed record token and parses to its short
// form
export const shortRecordToken = (token) => token.substring(0, 7);

// parseReceivedProposalsMap iterates over BE returned proposals map[token] => proposal, parses the
// metadata file & the proposal statuses
export const parseReceivedProposalsMap = (proposals) => {
  const parsedProps = {};
  for (const [token, prop] of Object.entries(proposals)) {
    parsedProps[shortRecordToken(token)] = parseRawProposal(prop);
  }
  return parsedProps;
};

/**
 * getProposalTimestamps
 * @param {Object} proposal
 * @returns {{publishedat: number, censoredat: number, abandonedat: number}} Object with publishedat, censoredat, abandonedat
 */
const getProposalTimestamps = (proposal, publishedts) => {
  const { status, timestamp, version } = proposal;
  let publishedat = 0,
    censoredat = 0,
    abandonedat = 0;
  // publlished but not edited
  if (status === PROPOSAL_STATUS_PUBLIC && version <= 1) {
    publishedat = timestamp;
  }
  // edited, have to grab published timestamp from metadata
  if (status === PROPOSAL_STATUS_PUBLIC && version > 1) {
    publishedat = publishedts;
  }
  if (status === PROPOSAL_STATUS_CENSORED) {
    censoredat = timestamp;
  }
  if (status === PROPOSAL_STATUS_ARCHIVED) {
    abandonedat = timestamp;
  }

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

// parseVoteMetadata accepts a proposal object and parses its votes metadata.
//
// censored proposals won't have metadata, in this case this function will
// return an empty object
const parseVoteMetadata = (proposal = {}) => {
  const metadata =
    proposal.files &&
    proposal.files.find((f) => f.name === VOTE_METADATA_FILENAME);
  return metadata ? JSON.parse(atob(metadata.payload)) : {};
};

// parseUserMetadata accepts a proposal object and parses its user plugin
// metadata. Returns a key-value object where the key is the status for
// that status change, and the value is their parsed json payload. If
// the metadata was not a status change one, the data will be inserted
// plainly in the object.
//
// proposals without any user metadata will return an empty object
const parseUserPluginMetadata = (proposal = {}) =>
  compose(
    reduce(
      (acc, curr) =>
        curr.status
          ? { ...acc, byStatus: { ...acc.byStatus, [curr.status]: curr } }
          : { ...acc, ...curr },
      { byStatus: {} }
    ),
    map(({ payload }) => {
      try {
        const parsedPayload = JSON.parse(payload);
        return parsedPayload;
      } catch (e) {
        // Parses metadata payload that may be nested without a json parent
        // on the payload response. This happens when there were more than
        // one status change to the proposal.
        return compose(
          reduce(
            (acc, curr) =>
              curr.status
                ? {
                    ...acc,
                    byStatus: {
                      ...acc.byStatus,
                      [curr.status]: curr
                    }
                  }
                : { ...acc, ...curr },
            { byStatus: {} }
          ),
          filter((md) => Object.keys(md).length),
          map((parsed) => JSON.parse(`{${parsed}}`)),
          splitFp(/\{(.*?)\}/)
        )(payload);
      }
    }),
    filter(({ pluginid }) => pluginid === USER_METADATA_PLUGIN),
    get("metadata")
  )(proposal);

// parseProposalIndexFile accepts a proposal object and parses its index.md
// file.
//
// censored proposals won't have metadata, in this case this function will
// return an empty object
const parseProposalIndexFile = (proposal = {}) => {
  const index =
    proposal.files && proposal.files.find((f) => f.name === "index.md");
  return index ? { description: getTextFromIndexMd(index) } : {};
};

// parseRawProposal accepts raw proposal object received from BE and parses
// its metadata & status changes
export const parseRawProposal = (proposal) => {
  // Parse metadatas
  const { name } = parseProposalMetadata(proposal);
  const { linkby, linkto } = parseVoteMetadata(proposal);
  const { description } = parseProposalIndexFile(proposal);
  const usermds = parseUserPluginMetadata(proposal);
  const statuschangemsg = usermds.byStatus[proposal.status]?.message;
  const statuschangepk = usermds.byStatus[proposal.status]?.publickey;

  // get prop timestamps
  const { publishedat, censoredat, abandonedat } = getProposalTimestamps(
    proposal,
    usermds.timestamp
  );

  return {
    ...proposal,
    description: description || proposal.description,
    name: name || proposal.name,
    linkby,
    userid: usermds.userid || proposal.userid,
    linkto,
    commentsCount: proposal.commentsCount || 0,
    statuschangemsg,
    statuschangepk,
    publishedat,
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
  const imageRegexParser =
    /!\[[^\]]*\]\((?<blob>.*?)(?="|\))(?<optionalpart>".*")?\)/g;
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
  const imageRegexParser =
    /!\[[^\]]*\]\((?<digest>.*?)(?="|\))(?<optionalpart>".*")?\)/g;
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
