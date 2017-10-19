import get from "lodash/fp/get";

export const getProposalStatus = (proposalStatus) => get(proposalStatus, [
  "Invalid",
  "NotFound",
  "NotReviewed",
  "Censored",
  "Public",
]);

export const getHumanReadableError = (errorCode) => get(errorCode, [
  "The operation returned an invalid status.",
  "", // Nothing to display when that's valid
  "The provided email address or password was invalid.",
  "The provided email address was malformed.",
  "The provided user activation token is invalid.",
  "The provided user activation token is expired.",
  "The provided proposal does not have a short name.",
  "The provided proposal does not have a description.",
  "The requested proposal does not exist.",
  "The submitted proposal has too many markdown files.",
  "The submitted proposal has too many images.",
  "The submitted proposal markdown is too large.",
  "The submitted proposal has one or more images that are too large.",
]);
