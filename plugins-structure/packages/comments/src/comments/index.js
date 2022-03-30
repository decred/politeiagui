import { recordComments } from "./comments";
import { commentsCount } from "./count";
import { commentsPolicy } from "./policy";
import { commentsTimestamps } from "./timestamps";
import { commentsVotes } from "./votes";
import { reducersArray } from "./constants";

export const comments = {
  comments: recordComments,
  count: commentsCount,
  policy: commentsPolicy,
  timestamps: commentsTimestamps,
  votes: commentsVotes,
};

export const commentsConstants = {
  reducersArray,
};
