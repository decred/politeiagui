import invert from "lodash/fp/invert";
import {
  TICKETVOTE_STATUS_APPROVED,
  TICKETVOTE_STATUS_AUTHORIZED,
  TICKETVOTE_STATUS_FINISHED,
  TICKETVOTE_STATUS_INELIGIBLE,
  TICKETVOTE_STATUS_REJECTED,
  TICKETVOTE_STATUS_STARTED,
  TICKETVOTE_STATUS_UNAUTHORIZED,
} from "./constants.js";

const statusToString = {
  [TICKETVOTE_STATUS_UNAUTHORIZED]: "unauthorized",
  [TICKETVOTE_STATUS_AUTHORIZED]: "authorized",
  [TICKETVOTE_STATUS_STARTED]: "started",
  [TICKETVOTE_STATUS_FINISHED]: "finished",
  [TICKETVOTE_STATUS_APPROVED]: "approved",
  [TICKETVOTE_STATUS_REJECTED]: "rejected",
  [TICKETVOTE_STATUS_INELIGIBLE]: "ineligible",
};

export function getHumanReadableTicketvoteStatus(status) {
  if (typeof status === "string" && isNaN(status)) {
    if (validStringTicketvoteStatuses.find((st) => st === status)) {
      return status;
    }
  }
  if (isNaN(status)) {
    throw TypeError(
      `Invalid status. You are trying to get the status code of an invalid status. Valid ones are: ${validTicketvoteStatuses}`
    );
  }
  if (
    status < TICKETVOTE_STATUS_UNAUTHORIZED ||
    status > TICKETVOTE_STATUS_INELIGIBLE
  ) {
    throw TypeError(
      `Invalid status. You are trying to get the status code of an invalid status. Valid ones are: ${validTicketvoteStatuses}`
    );
  } else return statusToString[status];
}

export function getTicketvoteStatusCode(statusString) {
  if (typeof statusString === "number" || !isNaN(statusString)) {
    if (validNumberTicketvoteStatuses.find((st) => st == statusString)) {
      return Number(statusString);
    }
  }
  const stringToStatus = invert(statusToString);
  if (stringToStatus[statusString] === undefined) {
    throw TypeError(
      `Invalid status. You are trying to get the status code of an invalid status. Valid ones are: ${validTicketvoteStatuses}`
    );
  } else return Number(stringToStatus[statusString]);
}

export const validStringTicketvoteStatuses = [
  "unauthorized",
  "authorized",
  "started",
  "finished",
  "approved",
  "rejected",
  "ineligible",
];

export const validNumberTicketvoteStatuses = [
  TICKETVOTE_STATUS_UNAUTHORIZED,
  TICKETVOTE_STATUS_AUTHORIZED,
  TICKETVOTE_STATUS_STARTED,
  TICKETVOTE_STATUS_FINISHED,
  TICKETVOTE_STATUS_APPROVED,
  TICKETVOTE_STATUS_REJECTED,
  TICKETVOTE_STATUS_INELIGIBLE,
];

export const validTicketvoteStatuses = [
  ...validStringTicketvoteStatuses,
  ...validNumberTicketvoteStatuses,
];
