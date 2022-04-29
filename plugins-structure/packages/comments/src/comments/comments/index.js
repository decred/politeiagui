import {
  fetchComments,
  selectCommentsByToken,
  selectCommentsError,
  selectCommentsStatus,
  selectRecordCommentsById,
  selectRecordCommentsIds,
} from "./commentsSlice";
import { useRecordComments } from "./useComments";

export const recordComments = {
  fetch: fetchComments,
  selectByToken: selectCommentsByToken,
  selectById: selectRecordCommentsById,
  selectIds: selectRecordCommentsIds,
  selectError: selectCommentsError,
  selectStatus: selectCommentsStatus,
  useFetch: useRecordComments,
};
