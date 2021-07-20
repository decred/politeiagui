import invert from "lodash/fp/invert";

import { VOTE_STATUS_UNAUTHORIZED, VOTE_STATUS_AUTHORIZED, VOTE_STATUS_STARTED, VOTE_STATUS_FINISHED, VOTE_STATUS_APPROVED, VOTE_STATUS_REJECTED, VOTE_STATUS_INELIGIBLE } from "./constants";

const statusToString = {
  [VOTE_STATUS_UNAUTHORIZED]: "unauthorized",
  [VOTE_STATUS_AUTHORIZED]: "authorized",
  [VOTE_STATUS_STARTED]: "started",
  [VOTE_STATUS_FINISHED]: "finished",
  [VOTE_STATUS_APPROVED]: "approved",
  [VOTE_STATUS_REJECTED]: "rejected",
  [VOTE_STATUS_INELIGIBLE]: "ineligible"
}

export function getVoteStatusCode(statusString) {
  const stringToStatus = invert(statusToString);
  if (stringToStatus[statusString] === undefined) {
    throw Error(`Invalid status. You are trying to get the status code of an invalid status.`)
  }
  else return Number(stringToStatus[statusString]);
}
