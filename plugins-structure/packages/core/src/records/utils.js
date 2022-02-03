import invert from "lodash/fp/invert";
import without from "lodash/fp/without";
import take from "lodash/fp/take";
import {
  RECORD_STATUS_UNREVIEWED,
  RECORD_STATUS_PUBLIC,
  RECORD_STATUS_CENSORED,
  RECORD_STATUS_ARCHIVED,
  RECORD_STATE_UNVETTED,
  RECORD_STATE_VETTED,
} from "./constants.js";

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

export function getTokensToFetch({ records, pageSize, inventory }) {
  let { lastTokenPos, tokens } = inventory;
  let tokensToFetch = [];
  if (lastTokenPos === null) {
    // means it's the first fetch
    tokensToFetch = take(pageSize, tokens);
    lastTokenPos = tokensToFetch.length - 1;
  } else {
    // not the first fetch
    tokensToFetch = take(pageSize, tokens.slice(lastTokenPos + 1));
    lastTokenPos += tokensToFetch.length;
  }
  // skip tokens if already lodaded
  return skipTokensAlreadyLoaded({
    tokens: tokensToFetch,
    records: records.records,
    lastTokenPos,
    inventory: tokens,
  });
}

export function skipTokensAlreadyLoaded({
  tokens,
  records,
  lastTokenPos,
  inventory,
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
    if (lastTokenPos < inventory.length - 2) {
      newTokens.push(inventory[lastTokenPos + 1]);
      lastTokenPos++;
    } else {
      break;
    }
  }
  return skipTokensAlreadyLoaded({
    tokens: newTokens,
    records,
    lastTokenPos,
    inventory,
  });
}
