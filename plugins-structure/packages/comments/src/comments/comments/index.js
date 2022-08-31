import {
  fetchComments,
  selectCommentsByToken,
  selectCommentsError,
  selectCommentsStatus,
  selectRecordCommentsById,
  selectRecordCommentsIds,
} from "./commentsSlice";

export const recordComments = {
  fetch: fetchComments,
  selectByToken: selectCommentsByToken,
  selectById: selectRecordCommentsById,
  selectIds: selectRecordCommentsIds,
  selectError: selectCommentsError,
  selectStatus: selectCommentsStatus,
};
