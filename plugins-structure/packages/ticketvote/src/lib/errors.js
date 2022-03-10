function getTicketvotePluginErrorMessage(code, context = "") {
  const errorMap = {
    1: `The provided record token is invalid, ${context}`,
    2: "The provided user public key is invalid",
    3: "The provided signature is invalid",
    4: `The provided record version is invalid, ${context}`,
    5: `The provided authorization is invalid, ${context}`,
    6: `The start details for this vote are missing, ${context}`,
    7: `The start details for this vote are invalid, ${context}`,
    8: `The provided vote type is invalid, ${context}`,
    9: `The provided vote duration is invalid, ${context}`,
    10: `The provided quorum is invalid, ${context}`,
    11: `The provided pass percentage is invalid, ${context}`,
    12: `The provided vote options are invalid, ${context}`,
    13: `The provided vote bits are invalid, ${context}`,
    14: `The parent for the runnoff vote is invalid, ${context}`,
    15: `The provided vote status is invalid, ${context}`,
    16: `The provided metadata for this vote is invalid, ${context}`,
    17: `The provided linkBy is invalid, ${context}`,
    18: `The provided linkTo is invalid, ${context}`,
    19: `The linkBy deadline for this record is not yet expired, ${context}`,
    20: `The provided record status is invalid, ${context}`,
  };

  return errorMap[code];
}

function getTicketvoteUserErrorMessage(code, context = "") {
  const errorMap = {
    0: "Invalid vote error.",
    1: "Internal server error.",
    2: "The user public key is not active",
    3: `Unauthorized: ${context}`,
    4: "The provided record was not found",
    5: "The provided record is locked",
    6: "The provided token is invalid",
    7: `The page size has exceeded: ${context}`,
    8: "The provided payload is duplicate",
  };

  return errorMap[code];
}

export function getTicketvoteError({ errorcode, pluginid, errorcontext }) {
  if (pluginid) {
    return getTicketvotePluginErrorMessage(errorcode, errorcontext);
  } else {
    return getTicketvoteUserErrorMessage(errorcode, errorcontext);
  }
}
