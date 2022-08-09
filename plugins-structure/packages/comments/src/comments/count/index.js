import {
  fetchCommentsCount,
  selectCommentsCountError,
  selectCommentsCountStatus,
  selectCommentsCounts
} from "./countSlice";

export const commentsCount = {
  fetch: fetchCommentsCount,
  selectAll: selectCommentsCounts,
  selectError: selectCommentsCountError,
  selectStatus: selectCommentsCountStatus
};
