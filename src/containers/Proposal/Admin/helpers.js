import {
  PROPOSAL_STATUS_UNREVIEWED,
  PROPOSAL_STATUS_CENSORED,
  PROPOSAL_STATUS_ARCHIVED,
  PROPOSAL_STATE_VETTED,
  PROPOSAL_STATE_UNVETTED
} from "src/constants";

export const tabValues = {
  UNREVIEWED: "Unreviewed",
  CENSORED: "Censored",
  ARCHIVED: "Archived"
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
      (prop) => prop.status === PROPOSAL_STATUS_UNREVIEWED
    );
  }

  if (tabOption === tabValues.VETTEDCENSORED) {
    return proposals.filter(
      (prop) =>
        prop.status === PROPOSAL_STATUS_CENSORED &&
        prop.state === PROPOSAL_STATE_VETTED
    );
  }

  if (tabOption === tabValues.UNVETTEDCENSORED) {
    return proposals.filter(
      (prop) =>
        prop.status === PROPOSAL_STATUS_CENSORED &&
        prop.state === PROPOSAL_STATE_UNVETTED
    );
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
  const { unreviewed, censored, archived } = proposalsTokens;
  switch (tabOption) {
    case tabValues.UNREVIEWED:
      return unreviewed;
    case tabValues.CENSORED:
      return censored;
    case tabValues.ARCHIVED:
      return archived;
    default:
      return [];
  }
};

/**
 * Returns an onject mapping the proposals tokens to each tab label
 * @param {array} tabLabels
 * @param {object} proposalsTokens
 */
export const mapProposalsTokensByTab = (tabLabels, proposalsTokens) =>
  tabLabels.reduce(
    (map, tab) => ({
      ...map,
      [tab]: getProposalTokensByTabOption(tab, proposalsTokens)
    }),
    {}
  );

export const statusByTab = {
  [tabValues.ARCHIVED]: PROPOSAL_STATUS_ARCHIVED,
  [tabValues.CENSORED]: PROPOSAL_STATUS_CENSORED,
  [tabValues.UNREVIEWED]: PROPOSAL_STATUS_UNREVIEWED
};
