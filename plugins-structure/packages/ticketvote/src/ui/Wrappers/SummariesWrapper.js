import PropTypes from "prop-types";
import { useEffect, useCallback } from "react";
import { ticketvoteSummaries } from "../../ticketvote/summaries";
import isEmpty from "lodash/fp/isEmpty";

export const TicketvoteSummariesWrapper = ({
  children,
  tokens,
  onFetchDone,
}) => {
  const {
    onFetchSummariesNextPage,
    summariesQueueStatus,
    summariesQueue,
    summaries,
    summariesStatus,
    allSummaries,
    onUpdateSummariesQueue,
  } = ticketvoteSummaries.useFetch({ tokens });

  const handleFetchSummariesNextPage = useCallback(async () => {
    if (summariesQueueStatus === "succeeded/isDone") {
      await onFetchDone();
    } else {
      await onFetchSummariesNextPage();
    }
  }, [onFetchSummariesNextPage, summariesQueueStatus, onFetchDone]);

  useEffect(
    function handleFetchInitialBatch() {
      if (summariesQueueStatus === "idle") {
        if (isEmpty(summariesQueue)) {
          onUpdateSummariesQueue();
        } else {
          onFetchSummariesNextPage();
        }
      }
    },
    [
      summariesQueueStatus,
      onFetchSummariesNextPage,
      summariesQueue,
      onUpdateSummariesQueue,
    ]
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
  onFetchDone: PropTypes.func,
};

TicketvoteSummariesWrapper.defaultProps = {
  onFetchDone: () => {},
};
