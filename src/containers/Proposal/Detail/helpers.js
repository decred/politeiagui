import { isAbandonedProposal, isVotingFinishedProposal } from "../helpers";

export const getCommentBlockedReason = (proposal, voteStatus) => {
  if (isAbandonedProposal(proposal)) {
    return "This proposal has been abandoned. New comments and comment votes are not allowed.";
  }

  if (isVotingFinishedProposal(voteStatus)) {
    return "Voting has finished for this proposal. New comments and comment votes are not allowed.";
  }

  return "";
};
