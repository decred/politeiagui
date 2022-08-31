import {
  fetchTicketvoteTimestamps,
  selectTicketvoteTimestampsByToken,
  selectTicketvoteTimestampsError,
  selectTicketvoteTimestampsStatus,
} from "./timestampsSlice";

export const ticketvoteTimestamps = {
  fetch: fetchTicketvoteTimestamps,
  selectByToken: selectTicketvoteTimestampsByToken,
  selectError: selectTicketvoteTimestampsError,
  selectStatus: selectTicketvoteTimestampsStatus,
};
