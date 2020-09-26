import orderBy from "lodash/fp/orderBy";
import { isAnchoring } from "src/helpers";

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
      ["desc", "desc"]
    )
  };

  return (
    mapOptionToSort[sortOption] ||
    mapOptionToSort[commentSortOptions.SORT_BY_TOP]
  );
};

export const sortComments = (sortOption, comments) => {
  const sorter = getSort(sortOption);
  return sorter(comments);
};

/**
 * This function use currying to efficiently handle comment censoring
 * @param {int} id
 * @param {string} reason
 */
export function handleCommentCensoringInfo(cb, ...args) {
  return function handleSubmitReason(reason) {
    return cb(...args, reason);
  };
}

export function handleCommentSubmission(cb, { token, parentID = 0, state }) {
  return (comment) => {
    if (isAnchoring()) {
      throw new Error(
        "Commenting temporarily unavailable while a daily censorship resistance routine is in progress. Sorry for the inconvenience. This will be fixed soon. Check back in 10 minutes."
      );
    }
    return cb({
      comment,
      token,
      parentID,
      state
    });
  };
}
