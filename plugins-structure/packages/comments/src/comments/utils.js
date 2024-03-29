import { comments } from "../comments";
import { store } from "@politeiagui/core";
import groupBy from "lodash/groupBy";
import keyBy from "lodash/keyBy";

export function fetchPolicyIfIdle() {
  if (comments.policy.selectStatus(store.getState()) === "idle") {
    return store.dispatch(comments.policy.fetch());
  }
}

/**
 * getCommentsByParent returns an object tree with comment ids ordered by parent
 * ids.
 * ****
 * Example:
 * ```javascript
 * const comments = [
 *   { commentid: 1, parentid: 0, ... },
 *   { commentid: 2, parentid: 1, ... },
 *   { commentid: 3, parentid: 1, ... },
 * ];
 * const commentsByParent = getCommentsByParent(comments);
 * // { 0: [1], 1: [2, 3], 2: [], 3: [] }
 * ```
 * @param {Array} comments comments array
 * @returns {Object} thread schema
 */
export function getCommentsByParent(comments) {
  const commentsByParent = comments.reduce((acc, comment) => {
    const { parentid, commentid } = comment;
    return {
      ...acc,
      [parentid]: [...(acc[parentid] || []), commentid],
      [commentid]: acc[commentid] || [],
    };
  }, {});
  return commentsByParent;
}

function getRootParentId(comments, comment, rootIteratee) {
  if (!comment) return;
  if (comment.parentid === 0) return rootIteratee(comment);
  return getRootParentId(comments, comments[comment.parentid], rootIteratee);
}

function groupCommentsByParentIds(comments, rootIteratee) {
  return groupBy(Object.values(comments), (comment) =>
    getRootParentId(comments, comment, rootIteratee)
  );
}

/**
 * keyCommentsThreadsBy returns comments threads organized by their root parent
 * ids, according to `rootIteratee` iteratee callback.
 * @param {{ [commentid]: Comment }} commentsById
 * @param {function} rootIteratee callback iteratee to be applied on thread
 * parents
 */
export function keyCommentsThreadsBy(
  commentsById,
  rootIteratee = (comment) => comment.commentid
) {
  if (!commentsById) return {};
  const commentsGroups = groupCommentsByParentIds(commentsById, rootIteratee);
  return Object.keys(commentsGroups).reduce((acc, groupId) => {
    return {
      ...acc,
      [groupId]: keyBy(commentsGroups[groupId], "commentid"),
    };
  }, {});
}
