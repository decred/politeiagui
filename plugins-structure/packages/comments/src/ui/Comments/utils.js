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
