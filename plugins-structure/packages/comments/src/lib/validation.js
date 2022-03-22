/**
 * validateCommentsCountsPageSize receives the state and returns if
 * `countpagesize` policy exists. If no policy is loaded, it will throw and log
 * an error.
 * @param {Object} state
 */
export function validateCommentsCountsPageSize(state) {
  const pageSize = state?.commentsPolicy?.policy?.countpagesize;
  if (!pageSize) {
    const error = Error(
      "Comments policy should be loaded before fetching counts. See `usePolicy` hook"
    );
    console.error(error);
    throw error;
  }
  return true;
}
