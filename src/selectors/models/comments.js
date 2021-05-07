import { createSelector } from "reselect";
import get from "lodash/fp/get";
import { shortRecordToken } from "src/helpers";

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

const getCommentsByToken = (token) => (commentsByToken) => {
  const comment = commentsByToken[token];
  if (comment) return comment;
  const commentsTokens = Object.keys(commentsByToken);
  // check if the provided token is prefix of original token
  const matchedTokenByPrefix = commentsTokens.find(
    (key) => shortRecordToken(key) === token
  );
  return commentsByToken[matchedTokenByPrefix];
};

export const makeGetRecordComments = (token) =>
  createSelector(commentsByToken, getCommentsByToken(token));

export const makeGetRecordCommentsLikes = (token) =>
  createSelector(commentsLikesByToken, getCommentsByToken(token));

export const makeGetLastAccessTime = (token) =>
  createSelector(accessTimeByToken, getCommentsByToken(token));
