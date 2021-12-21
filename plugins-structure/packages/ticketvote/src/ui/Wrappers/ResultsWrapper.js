import React from "react";
import { ticketvoteHooks } from "../../ticketvote";

export const TicketvoteRecordVoteResultsWrapper = ({ children, token }) => {
  const { results, onFetchResults, resultsError, resultsStatus } =
    ticketvoteHooks.useResults({
      token,
    });
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
