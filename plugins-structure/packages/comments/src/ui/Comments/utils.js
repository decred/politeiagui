export function getThreadSchema(comments, isFlatMode) {
  const threadSchema = comments.reduce((acc, comment) => {
    if (isFlatMode) {
      return { 0: [...(acc[0] || []), comment.commentid] };
    } else {
      return {
        ...acc,
        [comment.parentid]: [
          ...(acc[comment.parentid] || []),
          comment.commentid,
        ],
      };
    }
  }, {});
  return threadSchema;
}

export function sortByNew(commentsById) {
  return Object.values(commentsById).sort((a, b) => b.timestamp - a.timestamp);
}

export function sortByOld(commentsById) {
  return Object.values(commentsById).sort((a, b) => a.timestamp - b.timestamp);
}

export function sortByTop(commentsById) {
  return Object.values(commentsById).sort((a, b) => {
    const scoreA = a.upvotes - a.downvotes;
    const scoreB = b.upvotes - b.downvotes;
    return scoreB - scoreA;
  });
}
