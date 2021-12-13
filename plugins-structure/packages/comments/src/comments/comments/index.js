import {
  fetchComments,
  selectCommentsByToken,
  selectCommentsError,
  selectCommentsStatus,
  selectRecordCommentsById,
} from "./commentsSlice";

export const commentsComments = {
  fetch: fetchComments,
  selectByToken: selectCommentsByToken,
  selectById: selectRecordCommentsById,
  selectError: selectCommentsError,
  selectStatus: selectCommentsStatus,
};
