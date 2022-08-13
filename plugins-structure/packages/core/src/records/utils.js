import invert from "lodash/fp/invert";
import isEmpty from "lodash/fp/isEmpty";
import {
  RECORD_STATE_UNVETTED,
  RECORD_STATE_VETTED,
  RECORD_STATUS_ARCHIVED,
  RECORD_STATUS_CENSORED,
  RECORD_STATUS_PUBLIC,
  RECORD_STATUS_UNREVIEWED,
} from "./constants.js";
import { Buffer } from "buffer";
import { store } from "../storeSetup";
import { recordsPolicy } from "./policy";

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
 * decodeRecordFile returns the JSON decoded file payload.
 * @param {RecordFile} file record file
 * @returns {Object} JSON decoded file payload
 */
export function decodeRecordFile(file) {
  return file ? JSON.parse(Buffer.from(file.payload, "base64")) : {};
}

/**
 * encodeTextToFilePayload converts given `text` string to its encoded file
 * payload.
 * @param {string} text
 * @returns {string} encoded file payload
 */
export function encodeTextToFilePayload(text) {
  return window.btoa(unescape(encodeURIComponent(text)));
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

/**
 * getTokensToFetch Object Param
 * @typedef {{
 *   inventoryList: Array,
 *   lookupTable: Object,
 *   pageSize: Number,
 * }} TokensToFetchObjectParam
 */
/**
 * getTokensToFetch traverses the inventoryList of tokens and add them to a new
 * array if they are not in the lookupTable. If the new array reachs the length
 * of pageSize or the inventoryList comes to an end the loop will break and the
 * array will be returned
 * @param {TokensToFetchObjectParam} param
 * @returns {Array}
 */
export function getTokensToFetch({ inventoryList, lookupTable, pageSize }) {
  if (!inventoryList) return [];
  const tokensToFetch = [];
  let pos = 0;
  while (inventoryList[pos]) {
    const token = inventoryList[pos];
    if (lookupTable[token] === undefined) {
      tokensToFetch.push(token);
    }
    if (tokensToFetch.length === pageSize) break;
    pos++;
  }
  return tokensToFetch;
}

export function fetchPolicyIfIdle() {
  if (recordsPolicy.selectStatus(store.getState()) === "idle") {
    return store.dispatch(recordsPolicy.fetch());
  }
}
