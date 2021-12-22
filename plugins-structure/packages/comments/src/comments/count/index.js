import {
  fetchCommentsCount,
  selectCommentsCounts,
  selectCommentsCountError,
  selectCommentsCountStatus,
} from "./countSlice";

export const commentsCount = {
  fetch: fetchCommentsCount,
  selectAll: selectCommentsCounts,
  selectError: selectCommentsCountError,
  selectStatus: selectCommentsCountStatus,
};
