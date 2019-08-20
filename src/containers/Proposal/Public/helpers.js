export const tabValues = {
  IN_DISCUSSSION: "In Discussion",
  VOTING: "Voting",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  ABANDONED: "Abandoned"
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
 * Filter the proposals based on a given tab option and an object of proposals
 * tokens
 * @param {string} tabOption
 * @param {Array} proposals
 * @param {Object} proposalsTokens
 * @returns {Array} proposals
 */
export const getProposalsByTabOption = (
  tabOption,
  proposals,
  proposalsTokens
) => {
  const filterProposalsByTokens = (tokens, proposals) =>
    tokens.reduce((filteredProposals, token) => {
      const foundProp = proposals.find(
        prop =>
          prop && prop.censorshiprecord && token === prop.censorshiprecord.token
      );
      return foundProp
        ? filteredProposals.concat([foundProp])
        : filteredProposals;
    }, []);

  const tokens = getProposalTokensByTabOption(tabOption, proposalsTokens);

  return filterProposalsByTokens(tokens, proposals);
};
