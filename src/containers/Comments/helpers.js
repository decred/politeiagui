import orderBy from "lodash/fp/orderBy";

export const NUMBER_OF_LIST_PLACEHOLDERS = 3;

export const commentSortOptions = {
  SORT_BY_TOP: "Top",
  SORT_BY_OLD: "Old",
  SORT_BY_NEW: "New"
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
  return sorter(comments.map(comment => ({ ...comment, resultvotes: comment.upvotes - comment.downvotes })));
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
