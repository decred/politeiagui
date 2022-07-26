import {
  fetchTicketvoteSummaries,
  selectTicketvoteSummaries,
  selectTicketvoteSummariesByRecordToken,
  selectTicketvoteSummariesByStatus,
  selectTicketvoteSummariesByTokensBatch,
  selectTicketvoteSummariesError,
  selectTicketvoteSummariesFetchedTokens,
  selectTicketvoteSummariesStatus,
  selectTicketvoteSummariesStatusChangesByRecordToken,
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
  selectStatusChangesByToken:
    selectTicketvoteSummariesStatusChangesByRecordToken,
  useFetch: useTicketvoteSummaries,
};
