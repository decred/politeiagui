import { records } from "@politeiagui/core/records";
import { ticketvoteSummaries } from "@politeiagui/ticketvote/summaries";
import { commentsCount } from "@politeiagui/comments/count";
import { getStatusFromMultipleSlices } from "../../utils/getStatusFromMultipleSlices";

export function selectHomeStatus(state) {
  const countCommentsStatus = commentsCount.selectStatus(state);
  const summariesStatus = ticketvoteSummaries.selectStatus(state);
  const recordsStatus = records.selectStatus(state);

  const statuses = [countCommentsStatus, summariesStatus, recordsStatus];

  return getStatusFromMultipleSlices(statuses);
}
