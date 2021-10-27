import invert from "lodash/fp/invert";

const TICKETVOTE_STATUS_UNAUTHORIZED = 1;
const TICKETVOTE_STATUS_AUTHORIZED = 2;
const TICKETVOTE_STATUS_STARTED = 3;
const TICKETVOTE_STATUS_FINISHED = 4;
const TICKETVOTE_STATUS_APPROVED = 5;
const TICKETVOTE_STATUS_REJECTED = 6;
const TICKETVOTE_STATUS_INELIGIBLE = 7;

const TICKETVOTE_VOTE_TYPE_INVALID = 0;
const TICKETVOTE_VOTE_TYPE_STANDARD = 1;
const TICKETVOTE_VOTE_TYPE_RUNOFF = 2;

const TICKETVOTE_STATUS_LABEL_MAP = {
  [TICKETVOTE_STATUS_UNAUTHORIZED]: "unauthorized",
  [TICKETVOTE_STATUS_AUTHORIZED]: "authorized",
  [TICKETVOTE_STATUS_STARTED]: "started",
  [TICKETVOTE_STATUS_FINISHED]: "finished",
  [TICKETVOTE_STATUS_APPROVED]: "approved",
  [TICKETVOTE_STATUS_REJECTED]: "rejected",
  [TICKETVOTE_STATUS_INELIGIBLE]: "ineligible"
};

const VALID_VOTE_STATUSES = [
  TICKETVOTE_STATUS_STARTED,
  TICKETVOTE_STATUS_FINISHED,
  TICKETVOTE_STATUS_APPROVED,
  TICKETVOTE_STATUS_REJECTED
];

export function statusToString(status) {
  return TICKETVOTE_STATUS_LABEL_MAP[status];
}

export function stringToStatus(statusLabel) {
  return +invert(TICKETVOTE_STATUS_LABEL_MAP)[statusLabel];
}

export function typeFromStatus(status = 0, isRunoff) {
  if (status.length) {
    status = stringToStatus(status);
  }
  let ret;
  if (VALID_VOTE_STATUSES.includes(status)) {
    ret = isRunoff
      ? TICKETVOTE_VOTE_TYPE_RUNOFF
      : TICKETVOTE_VOTE_TYPE_STANDARD;
  } else {
    ret = TICKETVOTE_VOTE_TYPE_INVALID;
  }
  return ret;
}
