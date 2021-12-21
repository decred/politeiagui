import { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ticketvoteSummaries } from "./";

export function useTicketvoteSummaries({ tokens, pageSize = 5, status }) {
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

  // Actions
  const onFetchSummaries = useCallback(
    (tokens) => dispatch(ticketvoteSummaries.fetch({ tokens, pageSize })),
    [dispatch, pageSize]
  );
  const onFetchSummariesNextPage = useCallback(
    () => dispatch(ticketvoteSummaries.fetchNextPage({ pageSize })),
    [dispatch, pageSize]
  );
  const setSummariesFetchQueue = useCallback(
    (tokens) => dispatch(ticketvoteSummaries.setFetchQueue({ tokens })),
    [dispatch]
  );
  const pushSummariesFetchQueue = useCallback(
    (tokens) => dispatch(ticketvoteSummaries.pushFetchQueue({ tokens })),
    [dispatch]
  );

  // Effects
  useEffect(() => {
    if (summariesQueueStatus === "idle") {
      setSummariesFetchQueue(tokens);
    }
  }, [
    summariesQueueStatus,
    setSummariesFetchQueue,
    tokens,
    status,
    onFetchSummariesNextPage,
  ]);

  return {
    summaries,
    allSummaries,
    summariesError,
    summariesStatus,
    summariesQueueStatus,
    onFetchSummaries,
    onFetchSummariesNextPage,
    setSummariesFetchQueue,
    pushSummariesFetchQueue,
  };
}
