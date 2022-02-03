import {
  fetchTicketvoteSummaries,
  fetchTicketvoteSummariesNextPage,
  setFetchQueue,
  selectTicketvoteSummariesStatus,
  selectHasMoreTicketvoteSummariesToFetch,
  selectTicketvoteSummaries,
  selectTicketvoteSummariesByRecordToken,
  selectTicketvoteSummariesByTokensBatch,
  selectTicketvoteSummariesByStatus,
  selectTicketvoteSummariesError,
  selectTicketvoteSummariesFetchQueue,
  selectTicketvoteSummariesFetchQueueStatus,
  selectTicketvoteSummariesFetchedTokens,
} from "./summariesSlice";

import { useTicketvoteSummaries } from "./useSummaries";

export const ticketvoteSummaries = {
  fetch: fetchTicketvoteSummaries,
  fetchNextPage: fetchTicketvoteSummariesNextPage,
  setQueue: setFetchQueue,
  selectStatus: selectTicketvoteSummariesStatus,
  selectAll: selectTicketvoteSummaries,
  selectByToken: selectTicketvoteSummariesByRecordToken,
  selectByTokensBatch: selectTicketvoteSummariesByTokensBatch,
  selectByStatus: selectTicketvoteSummariesByStatus,
  selectError: selectTicketvoteSummariesError,
  selectFetchedTokens: selectTicketvoteSummariesFetchedTokens,
  selectFetchQueue: selectTicketvoteSummariesFetchQueue,
  selectFetchQueueStatus: selectTicketvoteSummariesFetchQueueStatus,
  selectHasMore: selectHasMoreTicketvoteSummariesToFetch,
  useFetch: useTicketvoteSummaries,
};
