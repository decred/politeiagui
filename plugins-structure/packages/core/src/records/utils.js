import invert from "lodash/fp/invert";
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
