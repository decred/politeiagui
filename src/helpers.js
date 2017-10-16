import get from "lodash/fp/get";

export const getProposalStatus = (proposalStatus) => get(proposalStatus, [
  "Invalid",
  "NotFound",
  "NotReviewed",
  "Censored",
  "Public",
]);
