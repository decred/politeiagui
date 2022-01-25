import React from "react";
import { ticketvoteResults } from "../../ticketvote/results";

export const TicketvoteRecordVoteResultsWrapper = ({ children, token }) => {
  const { results, onFetchResults, resultsError, resultsStatus } =
    ticketvoteResults.useFetch({ token });
  return (
    <div>
      {children &&
        children({
          ticketvoteResults: results,
          ticketvoteResultsError: resultsError,
          ticketvoteResultsStatus: resultsStatus,
          onFetchTicketvoteResults: onFetchResults,
        })}
    </div>
  );
};
