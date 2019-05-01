import {
  setQueryStringValue,
  getQueryStringValue
} from "../../lib/queryString";

export const tabValues = {
  IN_DISCUSSSION: "discussion",
  VOTING: "voting",
  APPROVED: "approved",
  REJECTED: "rejected",
  ABANDONED: "abandoned"
};

export const validTabValue = value =>
  Object.keys(tabValues).find(k => tabValues[k] === value);

export const getInitialTabValue = () => {
  const tabOption = getQueryStringValue("tab");
  return tabOption && validTabValue(tabOption)
    ? tabOption
    : tabValues.IN_DISCUSSSION;
};

export const setTabValueInQS = tab => setQueryStringValue("tab", tab);

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
