import {
  PROPOSAL_STATUS_PUBLIC,
  PROPOSAL_STATUS_CENSORED,
  PROPOSAL_STATUS_ARCHIVED,
  PROPOSAL_VOTING_NOT_AUTHORIZED,
  PROPOSAL_VOTING_AUTHORIZED,
  PROPOSAL_VOTING_ACTIVE,
  PROPOSAL_VOTING_APPROVED,
  PROPOSAL_VOTING_REJECTED
} from "src/constants";

export const tabValues = {
  IN_DISCUSSION: "In Discussion",
  AUTHORIZED: "Authorized Voting",
  VOTING: "Active Voting",
  APPROVED: "Approved Voting",
  REJECTED: "Rejected Voting",
  PUBLIC: "Public Proposals",
  ARCHIVED: "Archived Proposals",
  CENSORED: "Censored Proposals"
};

export const noProposalMessage = "No proposals available";

/**
 * Returns an array of proposal tokens for the given tab option
 * @param {string} tabOption
 * @param {Object} proposalsTokens
 * @returns {Array} array of proposals tokens
 */
export const getProposalTokensByTabOption = (tabOption, proposalsTokens) => {
  if (!proposalsTokens) return [];
  const {
    unauthorized,
    active,
    approved,
    rejected,
    archived,
    public: publicTokens,
    authorized,
    censored
  } = proposalsTokens;
  switch (tabOption) {
    case tabValues.IN_DISCUSSION:
      return unauthorized;
    case tabValues.AUTHORIZED:
      return authorized;
    case tabValues.VOTING:
      return active;
    case tabValues.APPROVED:
      return approved;
    case tabValues.REJECTED:
      return rejected;
    case tabValues.ARCHIVED:
      return archived;
    case tabValues.PUBLIC:
      return publicTokens;
    case tabValues.CENSORED:
      return censored;
    default:
      return [];
  }
};

/**
 * Returns an onject mapping the proposals tokens to each tab label
 * @param {array} tabLabels
 * @param {object} proposalsTokens
 */
export const mapProposalsTokensByTab = (tabLabels, proposalsTokens) => {
  return tabLabels.reduce((map, tab) => {
    return {
      ...map,
      [tab]: getProposalTokensByTabOption(tab, proposalsTokens)
    };
  }, {});
};

export const statusByTab = {
  [tabValues.IN_DISCUSSION]: {
    isVoteStatus: true,
    value: PROPOSAL_VOTING_NOT_AUTHORIZED
  },
  [tabValues.AUTHORIZED]: {
    isVoteStatus: true,
    value: PROPOSAL_VOTING_AUTHORIZED
  },
  [tabValues.VOTING]: { isVoteStatus: true, value: PROPOSAL_VOTING_ACTIVE },
  [tabValues.APPROVED]: {
    isVoteStatus: true,
    value: PROPOSAL_VOTING_APPROVED
  },
  [tabValues.REJECTED]: {
    isVoteStatus: true,
    value: PROPOSAL_VOTING_REJECTED
  },
  [tabValues.ARCHIVED]: { value: PROPOSAL_STATUS_ARCHIVED },
  [tabValues.CENSORED]: { value: PROPOSAL_STATUS_CENSORED },
  [tabValues.PUBLIC]: { value: PROPOSAL_STATUS_PUBLIC }
};
