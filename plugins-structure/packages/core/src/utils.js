import invert from "lodash/fp/invert";
import {
  RECORD_STATUS_UNREVIEWED,
  RECORD_STATUS_PUBLIC,
  RECORD_STATUS_CENSORED,
  RECORD_STATUS_ARCHIVED,
  RECORD_STATE_UNVETTED,
  RECORD_STATE_VETTED,
} from "./records/constants.js";

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
  if (typeof status === "string") {
    if (validStringRecordStatuses.find((st) => st === status)) {
      return status;
    }
    return "invalid";
  }
  if (status < RECORD_STATUS_UNREVIEWED && status > RECORD_STATUS_ARCHIVED)
    return "invalid";
  else return statusToString[status];
}

export function getRecordStatusCode(statusString) {
  if (typeof statusString === "number") {
    if (validNumberRecordStatuses.find((st) => st === statusString)) {
      return statusString;
    }
  }
  const stringToStatus = invert(statusToString);
  if (stringToStatus[statusString] === undefined) {
    throw Error(
      `Invalid status. You are trying to get the status code of an invalid status. Valid strings are: ${statusToString[RECORD_STATUS_UNREVIEWED]}, ${statusToString[RECORD_STATUS_PUBLIC]}, ${statusToString[RECORD_STATUS_CENSORED]} and ${statusToString[RECORD_STATUS_ARCHIVED]}`
    );
  } else return Number(stringToStatus[statusString]);
}

export function getHumanReadableRecordState(state) {
  if (typeof state === "string") {
    if (validStringRecordStates.find((st) => st === state)) {
      return state;
    }
    return "invalid";
  }
  if (state < RECORD_STATE_UNVETTED && state > RECORD_STATE_VETTED)
    return "invalid";
  else return stateToString[state];
}

export function getRecordStateCode(stateString) {
  if (typeof stateString === "number") {
    if (validNumberRecordStates.find((st) => st === stateString)) {
      return stateString;
    }
  }
  const stringToState = invert(stateToString);
  if (stringToState[stateString] === undefined) {
    throw Error(
      `Invalid state. You are trying to get the state code of an invalid state. Valid strings are: ${stateToString[RECORD_STATE_UNVETTED]} and ${stateToString[RECORD_STATE_VETTED]}`
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
