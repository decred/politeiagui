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

export function getRecordStatusCode(statusString) {
  if (typeof statusString === "number" || !isNaN(statusString)) {
    if (validNumberRecordStatuses.find((st) => st == statusString)) {
      return Number(statusString);
    }
  }
  const stringToStatus = invert(statusToString);
  if (stringToStatus[statusString] === undefined) {
    throw TypeError(
      `Invalid status. You are trying to get the status code of an invalid status. Valid ones are: ${validRecordStatuses}`
    );
  } else return Number(stringToStatus[statusString]);
}

export function getHumanReadableRecordState(state) {
  if (typeof state === "string" && isNaN(state)) {
    if (validStringRecordStates.find((st) => st === state)) {
      return state;
    }
  }
  if (isNaN(state)) {
    throw TypeError(
      `Invalid state. You are trying to get the state code of an invalid state. Valid ones are: ${validRecordStates}`
    );
  }
  if (state < RECORD_STATE_UNVETTED || state > RECORD_STATE_VETTED) {
    throw TypeError(
      `Invalid state. You are trying to get the state code of an invalid state. Valid ones are: ${validRecordStates}`
    );
  } else return stateToString[state];
}

export function getRecordStateCode(stateString) {
  if (typeof stateString === "number" || !isNaN(stateString)) {
    if (validNumberRecordStates.find((st) => st == stateString)) {
      return Number(stateString);
    }
  }
  const stringToState = invert(stateToString);
  if (stringToState[stateString] === undefined) {
    throw TypeError(
      `Invalid state. You are trying to get the state code of an invalid state. Valid ones are: ${validRecordStates}`
    );
  } else return Number(stringToState[stateString]);
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

export function decodeRecordFile(file) {
  return file ? JSON.parse(Buffer.from(file.payload, "base64")) : {};
}

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

export function getShortToken(token) {
  return token?.slice(0, 7);
}
