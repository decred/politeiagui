import orderBy from "lodash/fp/orderBy";
import { SORT_BY_NEW, SORT_BY_OLD, SORT_BY_TOP } from "../../constants";

const getSort = sortOption => {
  const mapOptionToSort = {
    [SORT_BY_NEW]: orderBy(["timestamp"], ["desc"]),
    [SORT_BY_OLD]: orderBy(["timestamp"], ["asc"]),
    [SORT_BY_TOP]: orderBy(["resultvotes", "timestamp"], ["desc", "desc"])
  };

  return mapOptionToSort[sortOption.value] || mapOptionToSort[SORT_BY_NEW];
};

const mergeCommentsAndVotes = (comments, votes) => {
  return votes
    ? comments.map(c => {
        const found = votes.find(element => element.commentid === c.commentid);
        return found ? { ...c, vote: found.action } : { ...c, vote: 0 };
      })
    : comments;
};

export const mergeNewComments = (sortedComments, updatedComments) => {
  return sortedComments.map(sc => {
    const found = updatedComments.find(uc => uc.commentid === sc.commentid);
    return found || sc;
  });
};

export const getUpdatedComments = (commentsLikes = [], comments) => {
  const updatedComments = commentsLikes.reduce((acc, cv) => {
    const found = comments.find(c => cv.commentid === c.commentid);
    return found ? acc.concat(found) : acc;
  }, []);
  return updatedComments;
};

export const updateSortedComments = (
  comments = [],
  sortOption,
  votes,
  needsSorting = true
) => {
  const votesandcomments = votes
    ? mergeCommentsAndVotes(comments, votes)
    : comments;
  const sorter = getSort(sortOption);
  const sortedComments = needsSorting
    ? sorter(votesandcomments)
    : votesandcomments;
  return sortedComments || [];
};
