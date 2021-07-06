import invert from "lodash/fp/invert";
import { RECORD_STATUS_UNREVIEWED, RECORD_STATUS_PUBLIC, RECORD_STATUS_CENSORED, RECORD_STATUS_ARCHIVED, RECORD_STATE_UNVETTED, RECORD_STATE_VETTED } from "./constants";

const statusToString = {
  [RECORD_STATUS_UNREVIEWED]: "unreviewed",
  [RECORD_STATUS_PUBLIC]: "public",
  [RECORD_STATUS_CENSORED]: "censored",
  [RECORD_STATUS_ARCHIVED]: "archived"
}

const stateToString = {
  [RECORD_STATE_UNVETTED]: "unvetted",
  [RECORD_STATE_VETTED]: "vetted"
}

export function getHumanReadableRecordStatus(status) {
  console.log(status);
  if (status < RECORD_STATUS_UNREVIEWED && status > RECORD_STATUS_ARCHIVED) return "invalid";
  else return statusToString[status];
}

export function getRecordStatusCode(statusString) {
  const stringToStatus = invert(statusToString);
  if (stringToStatus[statusString] === undefined) {
    throw Error(`Invalid status. You are trying to get the status code of an invalid status. Valid codes are: ${RECORD_STATUS_UNREVIEWED}, ${RECORD_STATUS_PUBLIC}, ${RECORD_STATUS_CENSORED} and ${RECORD_STATUS_ARCHIVED}`)
  }
  else return stringToStatus[statusString];
}

export function getHumanReadableRecordState(state) {
  if (state < RECORD_STATE_UNVETTED && state > RECORD_STATE_VETTED) return "invalid";
  else return stateToString[state];
}

export function getRecordStateCode(stateString) {
  const stringToState = invert(stateString);
  if (stringToState[stateString] === undefined) {
    throw Error(`Invalid status. You are trying to get the status code of an invalid status. Valid codes are: ${RECORD_STATE_UNVETTED} and ${RECORD_STATE_VETTED}`)
  }
  else return stringToState[stateString];
}