import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ticketvoteSummaries } from "./";
import { ticketvotePolicy } from "../policy";

export function useTicketvoteSummaries({ tokens }) {
  const dispatch = useDispatch();

  // Selectors
  const summaries = useSelector((state) =>
    ticketvoteSummaries.selectByTokensBatch(state, tokens)
  );
  const summariesStatus = useSelector(ticketvoteSummaries.selectStatus);
  const summariesError = useSelector(ticketvoteSummaries.selectError);
  const allSummaries = useSelector(ticketvoteSummaries.selectAll);
  const pageSize = useSelector((state) =>
    ticketvotePolicy.selectRule(state, "summariespagesize")
  );

  // Actions
  const onFetchSummaries = useCallback(
    (tokens) => dispatch(ticketvoteSummaries.fetch({ tokens })),
    [dispatch]
  );

  const onFetchSummariesNextPage = () => {};
  return {
    summaries,
    allSummaries,
    summariesError,
    summariesStatus,
    onFetchSummaries,
    onFetchSummariesNextPage,
  };
}
