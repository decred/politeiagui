import {
  fetchCommentsCount,
  selectCommentsCountError,
  selectCommentsCountStatus,
  selectCommentsCounts,
  selectCommentsCountsByTokensBatch,
} from "./countSlice";

export const commentsCount = {
  fetch: fetchCommentsCount,
  selectAll: selectCommentsCounts,
  selectByTokensBatch: selectCommentsCountsByTokensBatch,
  selectError: selectCommentsCountError,
  selectStatus: selectCommentsCountStatus,
};
