import {
  isAbandonedProposal,
  isRejectedProposal,
  isClosedProposal,
  isCompletedProposal
} from "../helpers";

export const getCommentBlockedReason = (proposalSummary) => {
  if (isAbandonedProposal(proposalSummary)) {
    return "This proposal has been abandoned. No additional changes are allowed.";
  }

  if (isRejectedProposal(proposalSummary)) {
    return "Voting has finished for this proposal. No additional changes are allowed.";
  }

  if (isClosedProposal(proposalSummary)) {
    return "Proposal is closed. No additional changes are allowed.";
  }

  if (isCompletedProposal(proposalSummary)) {
    return "Proposal is completed. No additional changes are allowed.";
  }

  return "";
};

export const getDetailsFile = (files = []) =>
  files.find((f) => f.name === "index.md");
