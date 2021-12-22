import {
  fetchComments,
  selectCommentsByToken,
  selectCommentsError,
  selectCommentsStatus,
  selectRecordCommentsById,
} from "./commentsSlice";

export const recordComments = {
  fetch: fetchComments,
  selectByToken: selectCommentsByToken,
  selectById: selectRecordCommentsById,
  selectError: selectCommentsError,
  selectStatus: selectCommentsStatus,
};
