import {
  fetchTicketvoteSummaries,
  selectTicketvoteSummariesStatus,
  selectTicketvoteSummaries,
  selectTicketvoteSummariesByRecordToken,
  selectTicketvoteSummariesByTokensBatch,
  selectTicketvoteSummariesByStatus,
  selectTicketvoteSummariesError,
  selectTicketvoteSummariesFetchedTokens,
} from "./summariesSlice";

import { useTicketvoteSummaries } from "./useSummaries";

export const ticketvoteSummaries = {
  fetch: fetchTicketvoteSummaries,
  selectStatus: selectTicketvoteSummariesStatus,
  selectAll: selectTicketvoteSummaries,
  selectByToken: selectTicketvoteSummariesByRecordToken,
  selectByTokensBatch: selectTicketvoteSummariesByTokensBatch,
  selectByStatus: selectTicketvoteSummariesByStatus,
  selectError: selectTicketvoteSummariesError,
  selectFetchedTokens: selectTicketvoteSummariesFetchedTokens,
  useFetch: useTicketvoteSummaries,
};
