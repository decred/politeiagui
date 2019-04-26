import {
  PROPOSAL_VOTING_NOT_AUTHORIZED,
  PROPOSAL_VOTING_AUTHORIZED,
  PROPOSAL_VOTING_ACTIVE,
  PROPOSAL_VOTING_FINISHED,
  PROPOSAL_STATUS_ABANDONED
} from "../../constants";

export const tabValues = {
  IN_DISCUSSSION: 0,
  VOTING: 1,
  FINISHED: 2,
  ABANDONED: 3
};

export const getProposalTokensByTabOption = (tabOption, proposalsTokens) => {
  if (!proposalsTokens) return [];
  const { pre, active, finished, abandoned } = proposalsTokens;
  switch (tabOption) {
    case tabValues.IN_DISCUSSSION:
      return pre;
    case tabValues.VOTING:
      return active;
    case tabValues.FINISHED:
      return finished;
    case tabValues.ABANDONED:
      return abandoned;
    default:
      return [];
  }
};

export const getProposalsByTabOption = (
  tabOption,
  proposals,
  getVoteStatus
) => {
  const proposalVotingStatus = proposal =>
    getVoteStatus(proposal.censorshiprecord.token).status;
  const mapTabOptionToFilter = {
    [tabValues.IN_DISCUSSSION]: p =>
      proposalVotingStatus(p) === PROPOSAL_VOTING_NOT_AUTHORIZED ||
      proposalVotingStatus(p) === PROPOSAL_VOTING_AUTHORIZED,
    [tabValues.VOTING]: p => proposalVotingStatus(p) === PROPOSAL_VOTING_ACTIVE,
    [tabValues.FINISHED]: p =>
      proposalVotingStatus(p) === PROPOSAL_VOTING_FINISHED,
    [tabValues.ABANDONED]: p => p.status === PROPOSAL_STATUS_ABANDONED
  };
  const filter = mapTabOptionToFilter[tabOption];

  return proposals.filter(filter);
};
