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

/**
 * Returns the amount of blocks from the bestBlock
 * @param {Number} block
 * @param {Number} bestBlock
 * @returns {Number} number of blocks left
 */
export function getVoteBlocksDiff(block, bestBlock) {
  if (!block || !bestBlock) return 0;
  return +block - bestBlock;
}

/**
 * Returns the blocks difference from current block height in milliseconds
 * @param {Number} block
 * @param {Number} currentHeight
 * @param {Number} blockDurationMinutes Block duration in minutes
 * @returns {Number}
 */
export function getTimestampFromBlocks(
  currentBlockHeight,
  bestBlock,
  blockDurationMinutes
) {
  const blocksDiff = getVoteBlocksDiff(currentBlockHeight, bestBlock);
  const blocksDiffMs = blocksDiff * blockDurationMinutes * 60 * 1000;
  const dateMs = blocksDiffMs + Date.now();
  return Math.round(dateMs / 1000); // returns unix timestamp
}

function getTicketvoteSummaryStatusChanges(
  voteSummary,
  blockDurationMinutes = 2
) {
  if (!voteSummary) return;
  const { bestblock, endblockheight, status } = voteSummary;
  switch (status) {
    case TICKETVOTE_STATUS_AUTHORIZED:
      return { status };
    case TICKETVOTE_STATUS_STARTED:
    case TICKETVOTE_STATUS_REJECTED:
    case TICKETVOTE_STATUS_APPROVED:
      return {
        ...voteSummary,
        timestamp: getTimestampFromBlocks(
          endblockheight,
          bestblock,
          blockDurationMinutes
        ),
        blocksCount: getVoteBlocksDiff(endblockheight, bestblock),
      };
    default:
      return;
  }
}

/**
 * getTicketvoteSummariesStatusChanges returns the status changes timestamps
 * for each summary from `summaries`, using given `blockDurationMinutes` param.
 * @param {Object} summaries Vote Summaries
 * @param {Number} blockDurationMinutes Block duration in minutes
 */
export function getTicketvoteSummariesStatusChanges(
  summaries,
  blockDurationMinutes
) {
  if (!summaries) return;
  return Object.keys(summaries).reduce((statusChanges, token) => {
    const statusChange = getTicketvoteSummaryStatusChanges(
      summaries[token],
      blockDurationMinutes
    );
    if (!statusChange) return statusChanges;
    return {
      ...statusChanges,
      [token]: statusChange,
    };
  }, {});
}
