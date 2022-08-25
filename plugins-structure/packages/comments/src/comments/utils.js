import { comments } from "../comments";
import { store } from "@politeiagui/core";

export function fetchPolicyIfIdle() {
  if (comments.policy.selectStatus(store.getState()) === "idle") {
    return store.dispatch(comments.policy.fetch());
  }
}

/**
 * getCommentsByParent returns an object tree with comment ids ordered by parent
 * ids. If thread is flat, all parent ids are 0.
 * ****
 * Example:
 * ```javascript
 * const comments = [
 *   { commentid: 1, parentid: 0, ... },
 *   { commentid: 2, parentid: 1, ... },
 *   { commentid: 3, parentid: 1, ... },
 * ];
 * const commentsByParent = getCommentsByParent(comments, false);
 * // { 0: [1], 1: [2, 3] }
 * const flatThreadSchema = getCommentsByParent(comments, true);
 * // { 0: [1, 2, 3] }
 * ```
 * @param {Array} comments comments array
 * @param {Boolean} isFlatMode
 * @returns {Object} thread schema
 */
export function getCommentsByParent(comments, isFlatMode) {
  const commentsByParent = comments.reduce((acc, comment) => {
    let parentid = comment.parentid;
    if (isFlatMode) {
      parentid = 0;
    }
    return {
      ...acc,
      [parentid]: [...(acc[parentid] || []), comment.commentid],
    };
  }, {});
  return commentsByParent;
}
