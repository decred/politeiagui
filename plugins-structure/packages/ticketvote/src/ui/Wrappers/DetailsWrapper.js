import React from "react";
import { ticketvoteHooks } from "../../ticketvote";

export const TicketvoteRecordVoteDetailsWrapper = ({ children, token }) => {
  const { details, onFetchDetails, detailsError, detailsStatus } =
    ticketvoteHooks.useDetails({
      token,
    });
  return (
    <div>
      {children &&
        children({
          ticketvoteDetails: details,
          ticketvoteDetailsError: detailsError,
          ticketvoteDetailsStatus: detailsStatus,
          onFetchTicketvoteDetails: onFetchDetails,
        })}
    </div>
  );
};
