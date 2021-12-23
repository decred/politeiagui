import {
  fetchCommentsTimestamps,
  selectCommentsTimestampsByToken,
  selectCommentsTimestampsError,
  selectCommentsTimestampsStatus,
} from "./timestampsSlice";

export const commentsTimestamps = {
  fetch: fetchCommentsTimestamps,
  selectByToken: selectCommentsTimestampsByToken,
  selectError: selectCommentsTimestampsError,
  selectStatus: selectCommentsTimestampsStatus,
};
