import { records } from "@politeiagui/core/records";
import { ticketvoteSummaries } from "@politeiagui/ticketvote/summaries";
import { commentsCount } from "@politeiagui/comments/count";
import { ticketvoteInventory } from "@politeiagui/ticketvote/inventory";
import { getStatusFromMultipleSlices } from "../../utils/getStatusFromMultipleSlices";
import isEmpty from "lodash/isEmpty";
import { piSummaries } from "../summaries";

export function selectListFetchStatus(state) {
  const countCommentsStatus = commentsCount.selectStatus(state);
  const summariesStatus = ticketvoteSummaries.selectStatus(state);
  const recordsStatus = records.selectStatus(state);
  const piSummariesStatus = piSummaries.selectStatus(state);

  const statuses = [];

  if (countCommentsStatus) statuses.push(countCommentsStatus);
  if (summariesStatus) statuses.push(summariesStatus);
  if (recordsStatus) statuses.push(recordsStatus);
  if (piSummariesStatus) statuses.push(piSummariesStatus);

  return getStatusFromMultipleSlices(statuses);
}

export function selectIsVoteInventoryListEmpty(state, status) {
  const tokens = ticketvoteInventory.selectByStatus(state, status);
  const fetchStatus = ticketvoteInventory.selectStatus(state, { status });
  return isEmpty(tokens) && fetchStatus === "succeeded/isDone";
}

export function selectIsMultiVoteInventoryListEmpty(state, statuses) {
  return statuses.every((status) =>
    selectIsVoteInventoryListEmpty(state, status)
  );
}
