import {
  fetchAllCommentsTimestamps,
  fetchCommentsTimestamps,
  selectCommentsTimestampsError,
  selectCommentsTimestampsStatus,
} from "./timestampsSlice";

export const commentsTimestamps = {
  fetch: fetchCommentsTimestamps,
  fetchAll: fetchAllCommentsTimestamps,
  selectError: selectCommentsTimestampsError,
  selectStatus: selectCommentsTimestampsStatus,
};
