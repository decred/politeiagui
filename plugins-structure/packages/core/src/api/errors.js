import { getDefaultErrorMessage } from "../client";

function getApiUserError(code) {
  const errorMap = {
    // TODO: fill API user error codes correctly when user layer gets
    // implemented on backend
  };

  return errorMap[code] || getDefaultErrorMessage(code, "");
}

export function getApiErrorMessage({ errorcode } = {}, defaultMessage) {
  if (!errorcode) {
    return defaultMessage;
  }
  return getApiUserError(errorcode);
}
