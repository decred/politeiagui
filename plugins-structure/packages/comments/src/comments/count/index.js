import {
  fetchCommentsCount,
  selectCommentsCounts,
  selectCommentsCountError,
  selectCommentsCountStatus,
} from "./countSlice";
import { useCommentsCount } from "./useCount";

export const commentsCount = {
  fetch: fetchCommentsCount,
  selectAll: selectCommentsCounts,
  selectError: selectCommentsCountError,
  selectStatus: selectCommentsCountStatus,
  useFetch: useCommentsCount,
};
