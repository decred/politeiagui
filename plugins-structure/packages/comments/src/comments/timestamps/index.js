import {
  fetchCommentsTimestamps,
  selectCommentsTimestampsByToken,
  selectCommentsTimestampsError,
  selectCommentsTimestampsStatus,
  setFetchDone,
} from "./timestampsSlice";

export const commentsTimestamps = {
  fetch: fetchCommentsTimestamps,
  setDone: setFetchDone,
  selectByToken: selectCommentsTimestampsByToken,
  selectError: selectCommentsTimestampsError,
  selectStatus: selectCommentsTimestampsStatus,
};
