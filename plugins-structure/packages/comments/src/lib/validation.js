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
/**
 * validateCommentsTimestampsPageSize receives the state and returns if
 * `timestampspagesize` policy exists. If no policy is loaded, it will throw and
 * log an error.
 * @param {Object} state
 */
export function validateCommentsTimestampsPageSize(state) {
  const pageSize = state?.commentsPolicy?.policy?.timestampspagesize;
  if (!pageSize) {
    const error = Error(
      "Comments policy should be loaded before fetching timestamps. See `usePolicy` hook"
    );
    console.error(error);
    throw error;
  }
  return true;
}
/**
 * validateCommentsVotesPageSize receives the state and returns if
 * `votespagesize` policy exists. If no policy is loaded, it will throw and
 * log an error.
 * @param {Object} state
 */
export function validateCommentsVotesPageSize(state) {
  const pageSize = state?.commentsPolicy?.policy?.votespagesize;
  if (!pageSize) {
    const error = Error(
      "Comments policy should be loaded before fetching votes. See `usePolicy` hook"
    );
    console.error(error);
    throw error;
  }
  return true;
}
