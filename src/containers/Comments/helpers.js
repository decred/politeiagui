import orderBy from "lodash/fp/orderBy";

export const NUMBER_OF_LIST_PLACEHOLDERS = 3;

export const commentSortOptions = {
  SORT_BY_TOP: "Top",
  SORT_BY_OLD: "Old",
  SORT_BY_NEW: "New"
};

/**
 * isInCommentTree returns whether the leafID is part of the provided comment
 * tree. A leaf is considered to be part of the tree if the leaf is a child of
 * the root or the leaf references the root itself.
 * @param {Int} rootId root node id.
 * @param {Int} leafId leaf node id.
 * @param {Map} comments array of comments.
 */
export const isInCommentTree = (rootId, leafId, comments) => {
  if (leafId === rootId) {
    return true;
  }

  // Convert comment array to a map
  const commentsMap = comments.reduce((map, comment) => {
    map[comment.commentid] = comment;
    return map;
  }, {});

  // Start with the provided comment leaf and traverse the comment tree up
  // until either the provided root ID is found or we reach the tree head. The
  // tree head will have a comment ID of 0.
  let current = commentsMap[leafId];
  while (current && current.parentid !== 0) {
    // Check if next parent in the tree is the rootID.
    if (current.parentid === rootId) {
      return true;
    }
    const newLeafId = current.parentid;
    current = commentsMap[newLeafId];
  }

  return false;
};

/**
 * Creates a select option from a string sort option.
 * @param {String} sortOption
 * @returns {Object} selectOption
 */
export const createSelectOptionFromSortOption = (sortOption) => ({
  label: sortOption,
  value: sortOption
});

/**
 * Return the sort select options.
 * @returns {Array} sortSelectOptions
 */
export const getSortOptionsForSelect = () =>
  Object.keys(commentSortOptions).map((key) =>
    createSelectOptionFromSortOption(commentSortOptions[key])
  );

/**
 * Returns a sort function accordingly to the sort option provided
 * @param {String} sortOption
 * @returns {Function} sorterFunction
 */
export const getSort = (sortOption) => {
  const mapOptionToSort = {
    [commentSortOptions.SORT_BY_NEW]: orderBy(["timestamp"], ["desc"]),
    [commentSortOptions.SORT_BY_OLD]: orderBy(["timestamp"], ["asc"]),
    [commentSortOptions.SORT_BY_TOP]: orderBy(
      ["resultvotes", "timestamp"],
      ["desc", "asc"]
    )
  };

  return (
    mapOptionToSort[sortOption] ||
    mapOptionToSort[commentSortOptions.SORT_BY_TOP]
  );
};

export const sortComments = (sortOption, comments) => {
  const sorter = getSort(sortOption);
  return sorter(
    comments.map((comment) => ({
      ...comment,
      resultvotes: comment.upvotes - comment.downvotes
    }))
  );
};

/**
 * This function use currying to efficiently handle comment censoring
 * @param {Function} cb
 * @param {Args} args callback args
 */
export function handleCommentCensoringInfo(cb, ...args) {
  return function handleSubmitReason(reason) {
    return cb(...args, reason);
  };
}
