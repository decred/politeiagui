import { records } from "@politeiagui/core/records";
import { recordsInventory } from "@politeiagui/core/records/inventory";
import { recordsPolicy } from "@politeiagui/core/records/policy";
import { ticketvoteSummaries } from "@politeiagui/ticketvote/summaries";
import { ticketvoteInventory } from "@politeiagui/ticketvote/inventory";
import { commentsCount } from "@politeiagui/comments/count";
import { getStatusFromMultipleSlices } from "../../utils/getStatusFromMultipleSlices";
import { piSummaries } from "../summaries";
import isEmpty from "lodash/isEmpty";

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

export function selectListPageSize(state) {
  return recordsPolicy.selectRule(state, "recordspagesize");
}

export function selectIsVoteInventoryListEmpty(state, status) {
  const tokens = ticketvoteInventory.selectByStatus(state, status);
  const fetchStatus = ticketvoteInventory.selectStatus(state, { status });
  return isEmpty(tokens) && fetchStatus === "succeeded/isDone";
}

export function selectIsRecordsInventoryListEmpty(
  state,
  { status, recordsState }
) {
  const tokens = recordsInventory.selectByStateAndStatus(state, {
    status,
    recordsState,
  });
  const fetchStatus = recordsInventory.selectStatus(state, {
    recordsState,
    status,
  });
  return isEmpty(tokens) && fetchStatus === "succeeded/isDone";
}
