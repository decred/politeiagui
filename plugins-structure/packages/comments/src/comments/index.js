import { recordComments } from "./comments";
import { commentsCount } from "./count";
import { commentsPolicy } from "./policy";
import { commentsTimestamps } from "./timestamps";

import { useRecordComments } from "./comments/useComments";
import { useCommentsCount } from "./count/useCount";
import { useCommentsPolicy } from "./policy/usePolicy";
import { useCommentsTimestamps } from "./timestamps/useTimestamps";

export const comments = {
  comments: recordComments,
  count: commentsCount,
  policy: commentsPolicy,
  timestamps: commentsTimestamps,
};

export const commentsHooks = {
  useComments: useRecordComments,
  useCount: useCommentsCount,
  usePolicy: useCommentsPolicy,
  useTimestamps: useCommentsTimestamps,
};
