import { records } from "@politeiagui/core/records";
import { ticketvoteSummaries } from "@politeiagui/ticketvote/summaries";
import { recordComments } from "@politeiagui/comments/comments";
import { piSummaries } from "../../pi";
import { getStatusFromMultipleSlices } from "../../utils/getStatusFromMultipleSlices";

export function selectDetailsStatus(state) {
  const recordStatus = records.selectStatus(state);
  const voteSummaryStatus = ticketvoteSummaries.selectStatus(state);
  const commentsStatus = recordComments.selectStatus(state);
  const piSummaryStatus = piSummaries.selectStatus(state);
  const statuses = [];

  if (recordStatus) statuses.push(recordStatus);
  if (voteSummaryStatus) statuses.push(voteSummaryStatus);
  if (commentsStatus) statuses.push(commentsStatus);
  if (piSummaryStatus) statuses.push(piSummaryStatus);

  return getStatusFromMultipleSlices(statuses);
}
