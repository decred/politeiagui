import {
  fetchTicketvoteTimestamps,
  selectTicketvoteTimestampsByToken,
  selectTicketvoteTimestampsError,
  selectTicketvoteTimestampsStatus,
} from "./timestampsSlice";

import { useTicketvoteTimestamps } from "./useTimestamps";

export const ticketvoteTimestamps = {
  fetch: fetchTicketvoteTimestamps,
  selectByToken: selectTicketvoteTimestampsByToken,
  selectError: selectTicketvoteTimestampsError,
  selectStatus: selectTicketvoteTimestampsStatus,
  useFetch: useTicketvoteTimestamps,
};
