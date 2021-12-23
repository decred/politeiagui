import { recordComments } from "./comments";
import { commentsCount } from "./count";
import { commentsPolicy } from "./policy";

import { useRecordComments } from "./comments/useComments";
import { useCommentsCount } from "./count/useCount";
import { useCommentsPolicy } from "./policy/usePolicy";

export const comments = {
  comments: recordComments,
  count: commentsCount,
  policy: commentsPolicy,
};

export const commentsHooks = {
  useComments: useRecordComments,
  useCount: useCommentsCount,
  usePolicy: useCommentsPolicy,
};
