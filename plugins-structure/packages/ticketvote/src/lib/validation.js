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
