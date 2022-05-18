import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ticketvoteSummaries } from "./";

export function useTicketvoteSummaries({ tokens }) {
  const dispatch = useDispatch();

  // Selectors
  const summaries = useSelector((state) =>
    ticketvoteSummaries.selectByTokensBatch(state, tokens)
  );
  const summariesStatus = useSelector(ticketvoteSummaries.selectStatus);
  const summariesError = useSelector(ticketvoteSummaries.selectError);
  const allSummaries = useSelector(ticketvoteSummaries.selectAll);

  // Actions
  const onFetchSummaries = useCallback(
    (tokens) => dispatch(ticketvoteSummaries.fetch({ tokens })),
    [dispatch]
  );

  return {
    summaries,
    allSummaries,
    summariesError,
    summariesStatus,
    onFetchSummaries,
  };
}
