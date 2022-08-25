import {
  fetchAllCommentsTimestamps,
  fetchCommentsTimestamps,
  selectCommentsTimestampsByToken,
  selectCommentsTimestampsError,
  selectCommentsTimestampsStatus,
} from "./timestampsSlice";

export const commentsTimestamps = {
  fetch: fetchCommentsTimestamps,
  fetchAll: fetchAllCommentsTimestamps,
  selectByToken: selectCommentsTimestampsByToken,
  selectError: selectCommentsTimestampsError,
  selectStatus: selectCommentsTimestampsStatus,
};
