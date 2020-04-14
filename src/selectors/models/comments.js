import { createSelector } from "reselect";
import get from "lodash/fp/get";

export const commentsByToken = get(["comments", "comments", "byToken"]);
export const accessTimeByToken = get([
  "comments",
  "comments",
  "accessTimeByToken"
]);
export const commentsLikesByToken = get([
  "comments",
  "commentsLikes",
  "byToken"
]);

export const makeGetRecordComments = (token) =>
  createSelector(commentsByToken, get(token));

export const makeGetRecordCommentsLikes = (token) =>
  createSelector(commentsLikesByToken, get(token));

export const makeGetLastAccessTime = (token) =>
  createSelector(accessTimeByToken, get(token));
