import { getShortToken } from "@politeiagui/core/records/utils";
import { records } from "@politeiagui/core/records";
import { ticketvoteSummaries } from "@politeiagui/ticketvote/summaries";
import { recordComments } from "@politeiagui/comments/comments";
import { piSummaries } from "../../pi";
import { getStatusFromMultipleSlices } from "../../utils/getStatusFromMultipleSlices";

export function selectDetailsStatus(state) {
  const recordStatus = records.selectStatus(state);
  const voteSummaryStatus = ticketvoteSummaries.selectStatus(state);
  const commentsStatus = recordComments.selectStatus(state);
  const piSummary = piSummaries.selectStatus(state);

  const statuses = [recordStatus, voteSummaryStatus, commentsStatus, piSummary];

  return getStatusFromMultipleSlices(statuses);
}

export function selectFullTokenFromStore(state, token) {
  const allRecords = records.selectAll(state);
  if (token.length > 7) {
    return token;
  }
  // is already in the store
  if (Object.keys(allRecords).length !== 0) {
    for (const key of Object.keys(allRecords)) {
      // it's loaded
      if (getShortToken(key) === token) {
        return key;
      }
    }
  }
  return null;
}
