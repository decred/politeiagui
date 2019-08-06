import {
  PROPOSAL_STATUS_UNREVIEWED,
  PROPOSAL_STATUS_CENSORED,
  PROPOSAL_STATUS_UNREVIEWED_CHANGES
} from "src/constants";

export const tabValues = {
  UNREVIEWED: "Unreviewed",
  CENSORED: "Censored"
};

/**
 * Filter the proposals based on a given tab option and an object of proposals
 * @param {string} tabOption
 * @param {Array} proposals
 * @returns {Array} proposals
 */
export const getProposalsByTabOption = (tabOption, proposals) => {
  if (tabOption === tabValues.UNREVIEWED) {
    return proposals.filter(
      prop =>
        prop.status === PROPOSAL_STATUS_UNREVIEWED ||
        prop.status === PROPOSAL_STATUS_UNREVIEWED_CHANGES
    );
  }

  if (tabOption === tabValues.CENSORED) {
    return proposals.filter(prop => prop.status === PROPOSAL_STATUS_CENSORED);
  }
  return proposals;
};

/**
 * Returns an array of proposal tokens for the given tab option
 * @param {string} tabOption
 * @param {Object} proposalsTokens
 * @returns {Array} array of proposals tokens
 */
export const getProposalTokensByTabOption = (tabOption, proposalsTokens) => {
  if (!proposalsTokens) return [];
  const { unreviewed, censored } = proposalsTokens;
  switch (tabOption) {
    case tabValues.UNREVIEWED:
      return unreviewed;
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

/**
 * Return the total amount of proposals by each tab
 * @param {object} proposalsAmountByReviewStatus
 * @return {object} proposalsAmountByTabOption
 */
export const getTotalAmountOfProposalsByTab = proposalsAmountByReviewStatus => {
  if (!proposalsAmountByReviewStatus) {
    return null;
  }
  const { numofunvetted, numofunvettedchanges, numofcensored } =
    proposalsAmountByReviewStatus || {};
  return {
    [tabValues.UNREVIEWED]: numofunvetted + numofunvettedchanges,
    [tabValues.CENSORED]: numofcensored,
    [tabValues.ALL]: numofunvetted + numofunvettedchanges + numofcensored
  };
};
