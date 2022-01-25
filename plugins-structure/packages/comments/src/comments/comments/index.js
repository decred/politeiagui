import {
  fetchComments,
  selectCommentsByToken,
  selectCommentsError,
  selectCommentsStatus,
  selectRecordCommentsById,
} from "./commentsSlice";
import { useRecordComments } from "./useComments";

export const recordComments = {
  fetch: fetchComments,
  selectByToken: selectCommentsByToken,
  selectById: selectRecordCommentsById,
  selectError: selectCommentsError,
  selectStatus: selectCommentsStatus,
  useFetch: useRecordComments,
};
