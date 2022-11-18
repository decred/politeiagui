import { records } from "@politeiagui/core/records";
import { recordsPolicy } from "@politeiagui/core/records/policy";
import { ticketvoteSummaries } from "@politeiagui/ticketvote/summaries";
import { commentsCount } from "@politeiagui/comments/count";
import { getStatusFromMultipleSlices } from "../../utils/getStatusFromMultipleSlices";
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

export function selectListPageSize(state) {
  return recordsPolicy.selectRule(state, "recordspagesize");
}
