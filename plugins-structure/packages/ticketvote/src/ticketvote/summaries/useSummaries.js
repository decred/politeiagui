import { getTokensToFetch } from "@politeiagui/core";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ticketvoteSummaries } from "./";
import { ticketvotePolicy } from "../policy";

export function useTicketvoteSummaries({ tokens }) {
  const dispatch = useDispatch();
  const [lastTokenPos, setLastTokenPos] = useState(null);

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

  const onFetchSummariesNextPage = useCallback(async () => {
    const { tokens: tokensToFetch, last } = getTokensToFetch({
      records: summaries,
      pageSize,
      inventoryList: tokens,
      lastTokenPos,
    });
    await onFetchSummaries(tokensToFetch);
    setLastTokenPos(last);
  }, [onFetchSummaries, lastTokenPos, pageSize, summaries, tokens]);

  return {
    summaries,
    allSummaries,
    summariesError,
    summariesStatus,
    onFetchSummaries,
    onFetchSummariesNextPage,
  };
}
