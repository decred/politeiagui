import {
  fetchTicketvoteSummaries,
  selectTicketvoteSummaries,
  selectTicketvoteSummariesByRecordToken,
  selectTicketvoteSummariesByStatus,
  selectTicketvoteSummariesByTokensBatch,
  selectTicketvoteSummariesError,
  selectTicketvoteSummariesFetchedTokens,
  selectTicketvoteSummariesStatus,
} from "./summariesSlice";

export const ticketvoteSummaries = {
  fetch: fetchTicketvoteSummaries,
  selectStatus: selectTicketvoteSummariesStatus,
  selectAll: selectTicketvoteSummaries,
  selectByToken: selectTicketvoteSummariesByRecordToken,
  selectByTokensBatch: selectTicketvoteSummariesByTokensBatch,
  selectByStatus: selectTicketvoteSummariesByStatus,
  selectError: selectTicketvoteSummariesError,
  selectFetchedTokens: selectTicketvoteSummariesFetchedTokens,
};
