import PropTypes from "prop-types";
import { useState, useEffect, useCallback } from "react";
import { ticketvoteHooks } from "../../ticketvote";
import { SUMMARIES_PAGE_SIZE } from "../../lib/constants";

export const TicketvoteSummariesWrapper = ({
  children,
  tokens,
  pageSize,
  initialFetch,
  isFetchAllowed,
  onFetchDone,
}) => {
  const [needsFetch, setNeedsFetch] = useState(initialFetch);
  const {
    onFetchSummariesNextPage,
    summariesQueueStatus,
    summaries,
    summariesStatus,
    allSummaries,
  } = ticketvoteHooks.useSummaries({ tokens, pageSize });

  const handleFetchSummariesNextPage = useCallback(async () => {
    if (summariesQueueStatus === "succeeded/hasMore") {
      await onFetchSummariesNextPage();
    } else if (summariesQueueStatus === "succeeded/isDone") {
      await onFetchDone();
      setNeedsFetch(true);
    }
  }, [onFetchSummariesNextPage, summariesQueueStatus, onFetchDone]);

  useEffect(
    function handleFetchInitialBatch() {
      const hasMore = summariesQueueStatus === "succeeded/hasMore";
      if (needsFetch && hasMore && isFetchAllowed) {
        onFetchSummariesNextPage();
        setNeedsFetch(false);
      }
    },
    [needsFetch, summariesQueueStatus, onFetchSummariesNextPage, isFetchAllowed]
  );

  return children({
    summaries,
    onFetchSummariesNextPage: handleFetchSummariesNextPage,
    summariesStatus,
    allSummaries,
  });
};

TicketvoteSummariesWrapper.propTypes = {
  tokens: PropTypes.arrayOf(PropTypes.string).isRequired,
  children: PropTypes.func.isRequired,
  pageSize: PropTypes.number,
  isFetchAllowed: PropTypes.bool,
  onFetchDone: PropTypes.func,
  initialFetch: PropTypes.bool,
};

TicketvoteSummariesWrapper.defaultProps = {
  pageSize: SUMMARIES_PAGE_SIZE,
  onFetchDone: () => {},
  isFetchAllowed: false,
  initialFetch: false,
};
