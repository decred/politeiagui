import {
  PROPOSAL_VOTING_INELIGIBLE,
  PROPOSAL_VOTING_NOT_AUTHORIZED,
  PROPOSAL_VOTING_ACTIVE,
  PROPOSAL_VOTING_APPROVED,
  PROPOSAL_VOTING_REJECTED
} from "src/constants";

export const tabValues = {
  UNDER_REVIEW: "Under Review",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  INELIGIBLE: "Abandoned"
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
  const { pre, started, approved, rejected, ineligible } = proposalsTokens;
  switch (tabOption) {
    case tabValues.UNDER_REVIEW:
      return [...started, ...pre];
    case tabValues.APPROVED:
      return approved;
    case tabValues.REJECTED:
      return rejected;
    case tabValues.INELIGIBLE:
      return ineligible;
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
  [tabValues.UNDER_REVIEW]: [
    PROPOSAL_VOTING_ACTIVE,
    PROPOSAL_VOTING_NOT_AUTHORIZED
  ],
  [tabValues.APPROVED]: [PROPOSAL_VOTING_APPROVED],
  [tabValues.REJECTED]: [PROPOSAL_VOTING_REJECTED],
  [tabValues.INELIGIBLE]: [PROPOSAL_VOTING_INELIGIBLE]
};

export const sortByTab = {
  [tabValues.UNDER_REVIEW]: {
    fields: ["voteStatus", "timestamp"],
    order: ["desc", "desc"]
  }
  // For other tabs = undefined (get the default)
};
