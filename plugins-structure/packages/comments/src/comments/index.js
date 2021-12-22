import { recordComments } from "./comments";
import { commentsCount } from "./count";
import { useRecordComments } from "./comments/useComments";
import { useCommentsCount } from "./count/useCount";

export const comments = {
  comments: recordComments,
  count: commentsCount,
};

export const commentsHooks = {
  useComments: useRecordComments,
  useCount: useCommentsCount,
};
