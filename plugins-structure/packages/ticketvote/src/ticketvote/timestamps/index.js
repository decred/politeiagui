import {
  fetchAllTicketvoteTimestamps,
  fetchTicketvoteTimestamps,
  selectTicketvoteTimestampsByToken,
  selectTicketvoteTimestampsError,
  selectTicketvoteTimestampsStatus,
} from "./timestampsSlice";

export const ticketvoteTimestamps = {
  fetch: fetchTicketvoteTimestamps,
  fetchAll: fetchAllTicketvoteTimestamps,
  selectByToken: selectTicketvoteTimestampsByToken,
  selectError: selectTicketvoteTimestampsError,
  selectStatus: selectTicketvoteTimestampsStatus,
};
