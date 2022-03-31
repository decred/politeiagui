import {
  fetchCommentsTimestamps,
  selectCommentsTimestampsByToken,
  selectCommentsTimestampsError,
  selectCommentsTimestampsStatus,
} from "./timestampsSlice";
import { useCommentsTimestamps } from "./useTimestamps";

export const commentsTimestamps = {
  fetch: fetchCommentsTimestamps,
  selectByToken: selectCommentsTimestampsByToken,
  selectError: selectCommentsTimestampsError,
  selectStatus: selectCommentsTimestampsStatus,
  useFetch: useCommentsTimestamps,
};
