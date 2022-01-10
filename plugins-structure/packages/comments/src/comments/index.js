import { recordComments } from "./comments";
import { commentsCount } from "./count";
import { commentsPolicy } from "./policy";
import { commentsTimestamps } from "./timestamps";
import { commentsVotes } from "./votes";

import { useRecordComments } from "./comments/useComments";
import { useCommentsCount } from "./count/useCount";
import { useCommentsPolicy } from "./policy/usePolicy";
import { useCommentsTimestamps } from "./timestamps/useTimestamps";
import { useCommentsVotes } from "./votes/useVotes";

export const comments = {
  comments: recordComments,
  count: commentsCount,
  policy: commentsPolicy,
  timestamps: commentsTimestamps,
  votes: commentsVotes,
};

export const commentsHooks = {
  useComments: useRecordComments,
  useCount: useCommentsCount,
  usePolicy: useCommentsPolicy,
  useTimestamps: useCommentsTimestamps,
  useVotes: useCommentsVotes,
};
