import React from "react";
import { ticketvoteHooks } from "../../ticketvote";

export const TicketvoteRecordVoteTimestampsWrapper = ({ children, token }) => {
  const { timestamps, onFetchTimestamps, timestampsStatus, timestampsError } =
    ticketvoteHooks.useTimestamps({
      token,
    });
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
