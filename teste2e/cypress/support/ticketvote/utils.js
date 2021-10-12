import invert from "lodash/fp/invert";

const TICKETVOTE_STATUS_UNAUTHORIZED = 1;
const TICKETVOTE_STATUS_AUTHORIZED = 2;
const TICKETVOTE_STATUS_STARTED = 3;
const TICKETVOTE_STATUS_FINISHED = 4;
const TICKETVOTE_STATUS_APPROVED = 5;
const TICKETVOTE_STATUS_REJECTED = 6;
const TICKETVOTE_STATUS_INELIGIBLE = 7;

const TICKETVOTE_STATUS_LABEL_MAP = {
  [TICKETVOTE_STATUS_UNAUTHORIZED]: "unauthorized",
  [TICKETVOTE_STATUS_AUTHORIZED]: "authorized",
  [TICKETVOTE_STATUS_STARTED]: "started",
  [TICKETVOTE_STATUS_FINISHED]: "finished",
  [TICKETVOTE_STATUS_APPROVED]: "approved",
  [TICKETVOTE_STATUS_REJECTED]: "rejected",
  [TICKETVOTE_STATUS_INELIGIBLE]: "ineligible"
};

export function statusToString(status) {
  return TICKETVOTE_STATUS_LABEL_MAP[status];
}

export function stringToStatus(statusLabel) {
  return invert(TICKETVOTE_STATUS_LABEL_MAP)[statusLabel];
}
