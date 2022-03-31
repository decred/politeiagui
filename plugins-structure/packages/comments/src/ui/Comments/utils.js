/**
 * getThreadSchema returns an object tree with comment ids ordered by parent
 * ids. If thread is flat, all parent ids are 0.
 * ****
 * Example:
 * ```javascript
 * const comments = [
 *   { commentid: 1, parentid: 0, ... },
 *   { commentid: 2, parentid: 1, ... },
 *   { commentid: 3, parentid: 1, ... },
 * ];
 * const threadSchema = getThreadSchema(comments, false);
 * // { 0: [1], 1: [2, 3] }
 * const flatThreadSchema = getThreadSchema(comments, true);
 * // { 0: [1, 2, 3] }
 * ```
 * @param {Array} comments comments array
 * @param {Boolean} isFlatMode
 * @returns {Object} thread schema
 */
export function getThreadSchema(comments, isFlatMode) {
  const threadSchema = comments.reduce((acc, comment) => {
    let parentid = comment.parentid;
    if (isFlatMode) {
      parentid = 0;
    }
    return {
      ...acc,
      [parentid]: [...(acc[parentid] || []), comment.commentid],
    };
  }, {});
  return threadSchema;
}

export function sortByNewest(commentsById) {
  return Object.values(commentsById).sort((a, b) => b.timestamp - a.timestamp);
}

export function sortByOldest(commentsById) {
  return Object.values(commentsById).sort((a, b) => a.timestamp - b.timestamp);
}

export function sortByScore(commentsById) {
  return Object.values(commentsById).sort((a, b) => {
    const scoreA = a.upvotes - a.downvotes;
    const scoreB = b.upvotes - b.downvotes;
    return scoreB - scoreA;
  });
}
