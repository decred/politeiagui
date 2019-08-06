export const tabValues = {
  IN_DISCUSSSION: "In Discussion",
  VOTING: "Voting",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  ABANDONED: "Abandoned"
};

/**
 * Returns an array of proposal tokens for the given tab option
 * @param {string} tabOption
 * @param {Object} proposalsTokens
 * @returns {Array} array of proposals tokens
 */
export const getProposalTokensByTabOption = (tabOption, proposalsTokens) => {
  if (!proposalsTokens) return [];
  const { pre, active, approved, rejected, abandoned } = proposalsTokens;
  switch (tabOption) {
    case tabValues.IN_DISCUSSSION:
      return pre;
    case tabValues.VOTING:
      return active;
    case tabValues.APPROVED:
      return approved;
    case tabValues.REJECTED:
      return rejected;
    case tabValues.ABANDONED:
      return abandoned;
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
