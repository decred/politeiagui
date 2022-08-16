import { getDefaultErrorMessage } from "../client";
export function getRecordsUserError(code, context = "") {
  const errorMap = {
    1: "Invalid inputs for request",
    2: "The provided record files are empty",
    3: `The file ${context} has an invalid name`,
    4: `The provided record has duplicate files: ${context}`,
    5: `The file ${context} has an invalid MIME type`,
    6: `The file ${context} has an unsupported MIME type.`,
    7: `The file ${context} has an invalid digest`,
    8: "The provided record mdstream has an invalid payload",
    9: `The provided record mdstream has an invalid ID ${context}`,
    10: "The provided user public key is invalid",
    11: "The provided signature is invalid",
    12: "The provided record token is invalid",
    13: "The record was not found",
    14: "The record is locked for changes",
    15: "The record has no changes and therefore cannot be updated",
    16: "The record state is invalid",
    17: "The record status is invalid",
    18: `The status transition is invalid: ${context}`,
    19: "The status reason was not found",
    20: "The number of requested record tokens exceeds the page size policy.",
  };

  return errorMap[code] || getDefaultErrorMessage(code, "records");
}

export function getRecordsErrorMessage(
  { errorcode, errorcontext } = {},
  defaultMessage
) {
  if (!errorcode) {
    return defaultMessage;
  }
  return getRecordsUserError(errorcode, errorcontext);
}
