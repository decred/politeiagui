import React from "react";
import { ticketvoteDetails } from "../../ticketvote/details";

export const TicketvoteRecordVoteDetailsWrapper = ({ children, token }) => {
  const { details, onFetchDetails, detailsError, detailsStatus } =
    ticketvoteDetails.useFetch({ token });
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
