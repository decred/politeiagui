import { useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ticketvoteSummaries } from "./";

export function useTicketvoteSummaries({ tokens }) {
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
    (tokens) => dispatch(ticketvoteSummaries.fetch({ tokens })),
    [dispatch]
  );
  const onFetchSummariesNextPage = useCallback(
    () => dispatch(ticketvoteSummaries.fetchNextPage()),
    [dispatch]
  );

  useEffect(() => {
    dispatch(ticketvoteSummaries.setQueue({ tokens }));
    dispatch(ticketvoteSummaries.fetchNextPage());
  }, [tokens, dispatch]);

  return {
    summaries,
    allSummaries,
    summariesError,
    summariesStatus,
    summariesQueue,
    summariesQueueStatus,
    onFetchSummaries,
    onFetchSummariesNextPage,
  };
}
