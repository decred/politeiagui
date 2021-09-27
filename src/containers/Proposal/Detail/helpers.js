import {
  isAbandonedProposal,
  isRejectedProposal,
  isClosedProposal,
  isCompletedProposal
} from "../helpers";

export const getCommentBlockedReason = (proposalSummary) => {
  if (isAbandonedProposal(proposalSummary)) {
    return "This proposal has been abandoned. New comments and comment votes are not allowed.";
  }

  if (isRejectedProposal(proposalSummary)) {
    return "Voting has finished for this proposal. New comments and comment votes are not allowed.";
  }

  if (isClosedProposal(proposalSummary)) {
    return "Proposal is closed. New comments, author updates and comment votes are not allowed.";
  }

  if (isCompletedProposal(proposalSummary)) {
    return "Proposal is completed. New comments, author updates and comment votes are not allowed.";
  }

  return "";
};

export const getDetailsFile = (files = []) =>
  files.find((f) => f.name === "index.md");
