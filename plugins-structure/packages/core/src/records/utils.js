import invert from "lodash/fp/invert";
import without from "lodash/fp/without";
import take from "lodash/fp/take";
import isEmpty from "lodash/fp/isEmpty";
import {
  RECORD_STATUS_UNREVIEWED,
  RECORD_STATUS_PUBLIC,
  RECORD_STATUS_CENSORED,
  RECORD_STATUS_ARCHIVED,
  RECORD_STATE_UNVETTED,
  RECORD_STATE_VETTED,
} from "./constants.js";
import { Buffer } from "buffer";

/**
 * Record File
 * @typedef {{
 *   name: String,
 *   mime: String,
 *   digest: String,
 *   payload: String
 * }} RecordFile
 */
/**
 * Record Metadata Stream
 * @typedef {{
 *   pluginid: String,
 *   streamid: Number,
 *   payload: String
 * }} MetadataStream
 */
/**
 * Record object
 * @typedef {{
 *   censorshiprecord: { token: String, merkle: String, signature: String },
 *   files: RecordFile[],
 *   metadata: MetadataStream[],
 *   state: Number,
 *   status: Number,
 *   timestamp: Number,
 *   username: String,
 *   version: Number
 * }} Record
 */

/**
 * Record token: record.censorshiprecord.token
 * @typedef {String} RecordToken
 */

const statusToString = {
  [RECORD_STATUS_UNREVIEWED]: "unreviewed",
  [RECORD_STATUS_PUBLIC]: "public",
  [RECORD_STATUS_CENSORED]: "censored",
  [RECORD_STATUS_ARCHIVED]: "archived",
};

const stateToString = {
  [RECORD_STATE_UNVETTED]: "unvetted",
  [RECORD_STATE_VETTED]: "vetted",
};

/**
 * getHumanReadableRecordStatus returns the readable record status and throws
 * an error if status is invalid or does not exist.
 * @param {Number | String} status record status
 * @returns {String} readable record status
 */
export function getHumanReadableRecordStatus(status) {
  if (typeof status === "string" && isNaN(status)) {
    if (validStringRecordStatuses.find((st) => st === status)) {
      return status;
    }
  }
  if (isNaN(status)) {
    throw TypeError(
      `Invalid status. You are trying to get the status code of an invalid status. Valid ones are: ${validRecordStatuses}`
    );
  }
  if (status < RECORD_STATUS_UNREVIEWED || status > RECORD_STATUS_ARCHIVED) {
    throw TypeError(
      `Invalid status. You are trying to get the status code of an invalid status. Valid ones are: ${validRecordStatuses}`
    );
  } else return statusToString[status];
}

/**
 * getRecordStatusCode returns the valid status code for given status. If status
 * is invalid, an error is thrown.
 * @param {String | Number} status record status
 * @returns {Number} record status code
 */
export function getRecordStatusCode(status) {
  if (typeof status === "number" || !isNaN(status)) {
    if (validNumberRecordStatuses.find((st) => st == status)) {
      return Number(status);
    }
  }
  const stringToStatus = invert(statusToString);
  if (stringToStatus[status] === undefined) {
    throw TypeError(
      `Invalid status. You are trying to get the status code of an invalid status. Valid ones are: ${validRecordStatuses}`
    );
  } else return Number(stringToStatus[status]);
}

/**
 * getHumanReadableRecordState returns the readable record state and throws
 * an error if state is invalid or does not exist.
 * @param {Number | String} recordState record state
 * @returns {String} readable record state
 */
export function getHumanReadableRecordState(recordState) {
  if (typeof recordState === "string" && isNaN(recordState)) {
    if (validStringRecordStates.find((st) => st === recordState)) {
      return recordState;
    }
  }
  if (isNaN(recordState)) {
    throw TypeError(
      `Invalid state. You are trying to get the state code of an invalid state. Valid ones are: ${validRecordStates}`
    );
  }
  if (
    recordState < RECORD_STATE_UNVETTED ||
    recordState > RECORD_STATE_VETTED
  ) {
    throw TypeError(
      `Invalid state. You are trying to get the state code of an invalid state. Valid ones are: ${validRecordStates}`
    );
  } else return stateToString[recordState];
}

/**
 * getRecordStatusCode returns the valid state code for given recordState.
 * If recordState is invalid, an error is thrown.
 * @param {Number | String} recordState record state
 * @returns {Number} record state code
 */
export function getRecordStateCode(recordState) {
  if (typeof recordState === "number" || !isNaN(recordState)) {
    if (validNumberRecordStates.find((st) => st == recordState)) {
      return Number(recordState);
    }
  }
  const stringToState = invert(stateToString);
  if (stringToState[recordState] === undefined) {
    throw TypeError(
      `Invalid state. You are trying to get the state code of an invalid state. Valid ones are: ${validRecordStates}`
    );
  } else return Number(stringToState[recordState]);
}

export const validStringRecordStatuses = [
  "unreviewed",
  "public",
  "censored",
  "archived",
];

export const validNumberRecordStatuses = [
  RECORD_STATUS_UNREVIEWED,
  RECORD_STATUS_PUBLIC,
  RECORD_STATUS_CENSORED,
  RECORD_STATUS_ARCHIVED,
];

export const validRecordStatuses = [
  ...validStringRecordStatuses,
  ...validNumberRecordStatuses,
];

export const validStringRecordStates = ["vetted", "unvetted"];

export const validNumberRecordStates = [
  RECORD_STATE_UNVETTED,
  RECORD_STATE_VETTED,
];

export const validRecordStates = [
  ...validStringRecordStates,
  ...validNumberRecordStates,
];

/**
 * getTokensToFetch returns the tokens batch and last position pointer for given
 * `inventory` and `pageSize`, indexed by `lastTokenPos` skipping `records`
 * already loaded.
 * @param {{
 *   records: Record[],
 *   pageSize: Number,
 *   inventoryList: RecordToken[],
 *   lastTokenPos: Number
 * }} fetchParams
 * @returns {Object} { tokens: RecordToken[], last: Number }
 */
export function getTokensToFetch({
  records,
  pageSize,
  inventoryList,
  lastTokenPos,
}) {
  if (inventoryList.length === 0)
    return {
      tokens: [],
      last: null,
    };
  let tokensToFetch = [];
  if (lastTokenPos === null) {
    // means it's the first fetch
    tokensToFetch = take(pageSize, inventoryList);
    lastTokenPos = tokensToFetch.length - 1;
  } else {
    // not the first fetch
    tokensToFetch = take(pageSize, inventoryList.slice(lastTokenPos + 1));
    lastTokenPos += tokensToFetch.length;
  }
  // skip tokens if already lodaded
  return skipTokensAlreadyLoaded({
    tokens: tokensToFetch,
    records,
    lastTokenPos,
    inventoryList,
  });
}

export function skipTokensAlreadyLoaded({
  tokens,
  records,
  lastTokenPos,
  inventoryList,
}) {
  const alreadyLoaded = [];
  for (const token of tokens) {
    if (records[token]) alreadyLoaded.push(token);
  }
  if (alreadyLoaded.length === 0) {
    return {
      tokens,
      last: lastTokenPos,
    };
  }
  const newTokens = without(alreadyLoaded, tokens);
  for (let i = 0; i < alreadyLoaded.length; i++) {
    if (lastTokenPos < inventoryList.length - 2) {
      newTokens.push(inventoryList[lastTokenPos + 1]);
      lastTokenPos++;
    } else {
      break;
    }
  }
  return skipTokensAlreadyLoaded({
    tokens: newTokens,
    records,
    lastTokenPos,
    inventoryList,
  });
}

/**
 * decodeRecordFile returns the JSON decoded file payload.
 * @param {RecordFile} file record file
 * @returns {Object} JSON decoded file payload
 */
export function decodeRecordFile(file) {
  return file ? JSON.parse(Buffer.from(file.payload, "base64")) : {};
}

/**
 * decodeRecordMetadata returns the metadata stream with its JSON decoded
 * payload.
 * @param {MetadataStream} metadataStream record's metadata stream
 * @returns {Object} JSON decoded file payload
 */
export function decodeRecordMetadata(metadataStream) {
  if (!metadataStream || !metadataStream.payload) return metadataStream;
  let parsedPayload;
  const { payload } = metadataStream;
  try {
    parsedPayload = JSON.parse(payload);
  } catch (e) {
    // parses metadata payload manually
    parsedPayload = payload
      .split(/\{(.*?)\}/)
      .map((parsed) => JSON.parse(`{${parsed}}`))
      .reduce((acc, curr) => (isEmpty(curr) ? acc : [...acc, curr]), []);
  }
  return { ...metadataStream, payload: parsedPayload };
}

/**
 * getShortToken returns a 7-character substring for given token param.
 * @param {String} token record token
 * @returns {String} short token with 7 characters
 */
export function getShortToken(token) {
  return token?.slice(0, 7);
}
