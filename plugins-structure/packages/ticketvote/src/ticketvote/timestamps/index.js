import {
  fetchAllTicketvoteTimestamps,
  fetchTicketvoteTimestamps,
  selectTicketvoteTimestampsError,
  selectTicketvoteTimestampsStatus,
} from "./timestampsSlice";

export const ticketvoteTimestamps = {
  fetch: fetchTicketvoteTimestamps,
  fetchAll: fetchAllTicketvoteTimestamps,
  selectError: selectTicketvoteTimestampsError,
  selectStatus: selectTicketvoteTimestampsStatus,
};
