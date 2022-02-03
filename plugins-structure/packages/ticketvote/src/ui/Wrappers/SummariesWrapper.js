import PropTypes from "prop-types";
import { useCallback } from "react";
import { ticketvoteSummaries } from "../../ticketvote/summaries";

export const TicketvoteSummariesWrapper = ({
  children,
  tokens,
  onFetchDone,
}) => {
  const {
    onFetchSummariesNextPage,
    summariesQueueStatus,
    summaries,
    summariesStatus,
    allSummaries,
  } = ticketvoteSummaries.useFetch({ tokens });

  const handleFetchSummariesNextPage = useCallback(async () => {
    if (summariesQueueStatus === "succeeded/isDone") {
      await onFetchDone();
    } else {
      await onFetchSummariesNextPage();
    }
  }, [onFetchSummariesNextPage, summariesQueueStatus, onFetchDone]);

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
