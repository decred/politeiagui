import { validTicketvoteStatuses } from "./utils";
export function validateTicketvoteStatus(recordStatus, isRequired = true) {
  if (isRequired && (recordStatus === null || recordStatus === undefined)) {
    const error = TypeError("status is required");
    console.error(error);
    throw error;
  }
  if (!validTicketvoteStatuses.find((st) => recordStatus == st)) {
    const error = TypeError(
      `Status '${recordStatus}' invalid. Valid statuses are: ${validTicketvoteStatuses}`
    );
    console.error(error);
    throw error;
  }
  return true;
}

/**
 * validateTicketvoteSummariesPageSize receives the state and returns if
 * summariespagesize exists. If no policy is loaded, it will throw and log an
 * error.
 * @param {Object} state
 */
export function validateTicketvoteSummariesPageSize(state) {
  // TODO: allow use of ?. operator with jest transpilers.
  const pageSize =
    state &&
    state.ticketvotePolicy &&
    state.ticketvotePolicy.policy &&
    state.ticketvotePolicy.policy.summariespagesize;

  // throw if there is no policy loaded
  if (!pageSize) {
    const error = Error(
      "Ticketvote policy should be loaded before fetching summaries. See `usePolicy` hook"
    );
    console.error(error);
    throw error;
  }
  return true;
}
/**
 * validateTicketvoteInventoryPageSize receives the state and returns if
 * inventorypagesize exists. If no policy is loaded, it will throw and log an
 * error.
 * @param {Object} state
 */
export function validateTicketvoteInventoryPageSize(state) {
  // TODO: allow use of ?. operator with jest transpilers.
  const pageSize =
    state &&
    state.ticketvotePolicy &&
    state.ticketvotePolicy.policy &&
    state.ticketvotePolicy.policy.inventorypagesize;

  // throw if there is no policy loaded
  if (!pageSize) {
    const error = Error(
      "Ticketvote policy should be loaded before fetching inventory. See `usePolicy` hook"
    );
    console.error(error);
    throw error;
  }
  return true;
}
/**
 * validateTicketvoteTimestampsPageSize receives the state and returns if
 * timestampspagesize exists. If no policy is loaded, it will throw and log an
 * error.
 * @param {Object} state
 */
export function validateTicketvoteTimestampsPageSize(state) {
  // TODO: allow use of ?. operator with jest transpilers.
  const pageSize =
    state &&
    state.ticketvotePolicy &&
    state.ticketvotePolicy.policy &&
    state.ticketvotePolicy.policy.timestampspagesize;

  // throw if there is no policy loaded
  if (!pageSize) {
    const error = Error(
      "Ticketvote policy should be loaded before fetching inventory. See `usePolicy` hook"
    );
    console.error(error);
    throw error;
  }
  return true;
}
