/**
 * validatePiSummariesPageSize receives the state and returns if pi
 * summariespagesize exists. If no policy is loaded, it will throw and log an
 * error.
 * @param {Object} state
 */
export function validatePiSummariesPageSize(state) {
  const pageSize =
    state &&
    state.pi &&
    state.pi.policy &&
    state.pi.policy.policy &&
    state.pi.policy.policy.summariespagesize;

  // throw if there is no policy loaded
  if (!pageSize) {
    const error = Error("Pi policy should be loaded before fetching summaries");
    console.error(error);
    throw error;
  }
  return true;
}
