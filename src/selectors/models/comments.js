import { createSelector } from "reselect";
import get from "lodash/fp/get";
import { shortRecordToken } from "src/helpers";

export const commentsInfoByToken = get(["comments", "comments", "byToken"]);
const commentsVotesByToken = get(["comments", "commentsVotes", "byToken"]);

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

const getByToken = (token) => (mapByToken) => {
  const shortToken = token && shortRecordToken(token);
  return mapByToken[shortToken];
};

const getSectionIds = ({ sectionIds } = {}) => sectionIds;

const getCommentsMap = ({ comments } = {}) => comments;

const getSectionComments =
  (sectionId) =>
  (commentsMap = {}) =>
    commentsMap[sectionId];

export const makeGetRecordCommentSectionIds = (token) =>
  createSelector(makeGetRecordCommentsInfo(token), getSectionIds);

export const makeGetRecordSectionComments = (token, sectionId) =>
  createSelector(makeGetRecordComments(token), getSectionComments(sectionId));

export const makeGetRecordComments = (token) =>
  createSelector(makeGetRecordCommentsInfo(token), getCommentsMap);

export const makeGetRecordCommentsInfo = (token) =>
  createSelector(commentsInfoByToken, getByToken(token));

export const makeGetRecordCommentsVotes = (token) =>
  createSelector(commentsVotesByToken, getByToken(token));

export const makeGetRecordCommentsLikes = (token) =>
  createSelector(commentsLikesByToken, getByToken(token));

export const makeGetLastAccessTime = (token) =>
  createSelector(accessTimeByToken, getByToken(token));
