import { createSelector } from "reselect";
import get from "lodash/fp/get";

const proposals = get(["proposalBilling", "proposals"]);

export const proposalsBilled = createSelector(proposals, (proposals = {}) =>
  Object.values(proposals)
);

export const proposalBillingDetails = (token) =>
  createSelector(proposals, (proposals = {}) => proposals[token]);
