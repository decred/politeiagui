import React from "react";
import { ticketvoteTimestamps } from "../../ticketvote/timestamps";

export const TicketvoteRecordVoteTimestampsWrapper = ({ children, token }) => {
  const { timestamps, onFetchTimestamps, timestampsStatus, timestampsError } =
    ticketvoteTimestamps.useFetch({ token });
  return (
    <div>
      {children &&
        children({
          ticketvoteTimestamps: timestamps,
          ticketvoteTimestampsError: timestampsError,
          ticketvoteTimestampsStatus: timestampsStatus,
          onFetchTicketvoteTimestamps: onFetchTimestamps,
        })}
    </div>
  );
};
