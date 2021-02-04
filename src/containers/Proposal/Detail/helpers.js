import { isAbandonedProposal, isVotingFinishedProposal } from "../helpers";

export const getCommentBlockedReason = (proposal, voteSummary) => {
  if (isAbandonedProposal(proposal)) {
    return "This proposal has been abandoned. New comments and comment votes are not allowed.";
  }

  if (isVotingFinishedProposal(voteSummary)) {
    return "Voting has finished for this proposal. New comments and comment votes are not allowed.";
  }

  return "";
};

export const getDetailsFile = (files = []) =>
  files.find((f) => f.name === "index.md");
