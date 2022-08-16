import { getDefaultErrorMessage } from "@politeiagui/core/client";

function getCommentsUserErrorMessage(code) {
  const errorMap = {
    1: "Invalid inputs for request",
    2: "You must be an author or admin to perform this action",
    3: "The user public key is not active",
    4: "The provided signature was invalid for this comment",
    5: "The record has an invalid state",
    6: "The record token is invalid",
    7: "The record was not found",
    8: "The record is locked for changes",
    9: "No tokens found in the count votes request",
  };

  return errorMap[code] || getDefaultErrorMessage(code, "comments");
}

function getCommentsPluginErrorMessage(code, context) {
  const errorMap = {
    1: `The provided proposal token is invalid, ${context}`,
    2: "The provided user public key is not active",
    3: "The provided signature is invalid",
    4: `The comment exceeds the maximum length allowed, ${context}`,
    5: "The comment has no changes and therefore cannot be updated",
    6: `The provided comment code is not found ${context}`,
    7: "Only the comment author is allowed to edit",
    8: `The provided parent ID is invalid, ${context}`,
    9: `The provided comment vote is invalid, ${context}`,
    10: "You have exceeded the max number of changes on your vote",
    12: "Backend does not accept the extra data needed for author updates",
    13: context,
    14: context,
  };

  return errorMap[code] || getDefaultErrorMessage(code, "comments");
}

export function getCommentsError(
  { errorcode, pluginid, errorcontext } = {},
  defaultMessage
) {
  if (!errorcode) {
    return defaultMessage;
  }
  if (pluginid) {
    return getCommentsPluginErrorMessage(errorcode, errorcontext);
  } else {
    return getCommentsUserErrorMessage(errorcode, errorcontext);
  }
}
