import { records } from "@politeiagui/core/records";
import { ticketvoteSummaries } from "@politeiagui/ticketvote/summaries";
import { commentsCount } from "@politeiagui/comments/count";
import { ticketvoteInventory } from "@politeiagui/ticketvote/inventory";
import { getStatusFromMultipleSlices } from "../../utils/getStatusFromMultipleSlices";
import isEmpty from "lodash/isEmpty";

export function selectHomeStatus(state) {
  const countCommentsStatus = commentsCount.selectStatus(state);
  const summariesStatus = ticketvoteSummaries.selectStatus(state);
  const recordsStatus = records.selectStatus(state);

  const statuses = [];

  if (countCommentsStatus) statuses.push(countCommentsStatus);
  if (summariesStatus) statuses.push(summariesStatus);
  if (recordsStatus) statuses.push(recordsStatus);

  return getStatusFromMultipleSlices(statuses);
}

export function selectIsStatusListEmpty(state, status) {
  const tokens = ticketvoteInventory.selectByStatus(state, status);
  const fetchStatus = ticketvoteInventory.selectStatus(state, { status });
  return isEmpty(tokens) && fetchStatus === "succeeded/isDone";
}

export function selectIsMultiStatusListEmpty(state, statuses) {
  return statuses.every((status) => selectIsStatusListEmpty(state, status));
}
