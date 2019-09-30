import { createSelector } from "reselect";
import get from "lodash/fp/get";

export const commentsByToken = get(["comments", "comments", "byToken"]);
export const commentsLikesByToken = get([
  "comments",
  "commentsLikes",
  "byToken"
]);

export const makeGetProposalComments = token =>
  createSelector(
    commentsByToken,
    commentsByToken => commentsByToken[token] || null
  );

export const makeGetProposalCommentsLikes = token =>
  createSelector(
    commentsLikesByToken,
    commentsLikesByToken => commentsLikesByToken[token] || null
  );
