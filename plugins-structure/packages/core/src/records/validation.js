import { validRecordStatuses, validRecordStates } from "./utils";

export function validateRecordState(recordState, isRequired = true) {
  if (isRequired && (recordState === null || recordState === undefined)) {
    const error = TypeError("recordsState is required");
    console.error(error);
    throw error;
  }
  if (!validRecordStates.find((st) => recordState == st)) {
    const error = TypeError(
      `State '${recordState}' invalid. Valid states are: ${validRecordStates}`
    );
    console.error(error);
    throw error;
  }
  return true;
}

export function validateRecordStatus(recordStatus, isRequired = true) {
  if (isRequired && (recordStatus === null || recordStatus === undefined)) {
    const error = TypeError("status is required");
    console.error(error);
    throw error;
  }
  if (!validRecordStatuses.find((st) => recordStatus == st)) {
    const error = TypeError(
      `Status '${recordStatus}' invalid. Valid statuses are: ${validRecordStatuses}`
    );
    console.error(error);
    throw error;
  }
  return true;
}

export function validateRecordsPageSize(state) {
  // TODO: allow use of ?. operator with jest transpilers.
  const pageSize =
    state &&
    state.recordsPolicy &&
    state.recordsPolicy.policy &&
    state.recordsPolicy.policy.recordspagesize;

  // throw if there is no policy loaded
  if (!pageSize) {
    const error = Error(
      "Records policy should be loaded before fetching records or records inventory. See `usePolicy` hook"
    );
    console.error(error);
    throw error;
  }
  return true;
}

export function validateInventoryPageSize(state) {
  // TODO: allow use of ?. operator with jest transpilers.
  const pageSize =
    state &&
    state.recordsPolicy &&
    state.recordsPolicy.policy &&
    state.recordsPolicy.policy.inventorypagesize;

  // throw if there is no policy loaded
  if (!pageSize) {
    const error = Error(
      "Records policy should be loaded before fetching records or records inventory. See `usePolicy` hook"
    );
    console.error(error);
    throw error;
  }
  return true;
}

export function validateRecordStateAndStatus(recordState, recordStatus) {
  return validateRecordState(recordState) && validateRecordStatus(recordStatus);
}
