import { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ticketvoteSummaries } from "./";

export function useTicketvoteSummaries({ tokens, pageSize = 5 }) {
  const dispatch = useDispatch();

  // Selectors
  const summaries = useSelector((state) =>
    ticketvoteSummaries.selectByTokensBatch(state, tokens)
  );
  const summariesStatus = useSelector(ticketvoteSummaries.selectStatus);
  const summariesQueueStatus = useSelector(
    ticketvoteSummaries.selectFetchQueueStatus
  );
  const summariesError = useSelector(ticketvoteSummaries.selectError);
  const allSummaries = useSelector(ticketvoteSummaries.selectAll);
  const summariesQueue = useSelector(ticketvoteSummaries.selectFetchQueue);

  // Actions
  const onFetchSummaries = useCallback(
    (tokens) => dispatch(ticketvoteSummaries.fetch({ tokens, pageSize })),
    [dispatch, pageSize]
  );
  const onFetchSummariesNextPage = useCallback(
    () => dispatch(ticketvoteSummaries.fetchNextPage({ pageSize })),
    [dispatch, pageSize]
  );
  const onUpdateSummariesQueue = useCallback(
    () => dispatch(ticketvoteSummaries.setFetchQueue({ tokens })),
    [dispatch, tokens]
  );
  const pushSummariesFetchQueue = useCallback(
    (tokens) => dispatch(ticketvoteSummaries.pushFetchQueue({ tokens })),
    [dispatch]
  );

  return {
    summaries,
    allSummaries,
    summariesError,
    summariesStatus,
    summariesQueue,
    summariesQueueStatus,
    onFetchSummaries,
    onFetchSummariesNextPage,
    onUpdateSummariesQueue,
    pushSummariesFetchQueue,
  };
}
