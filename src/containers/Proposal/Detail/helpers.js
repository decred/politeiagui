import { PROPOSAL_VOTING_FINISHED } from "src/constants";
import {
  isPublicProposal,
  isAbandonedProposal
} from "src/componentsv2/Proposal/helpers";

export const proposalCanReceiveComments = proposal => {
  return (
    isPublicProposal(proposal) &&
    proposal.voteStatus.status !== PROPOSAL_VOTING_FINISHED
  );
};

export const getCommentBlockedReason = proposal => {
  if (isAbandonedProposal(proposal)) {
    return "This proposal has been abandoned. New comments and comment votes are not allowed.";
  }

  if (proposal.voteStatus.status === PROPOSAL_VOTING_FINISHED) {
    return "Voting has finished for this proposal. New comments and comment votes are not allowed.";
  }

  return "";
};
