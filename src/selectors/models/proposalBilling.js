import { createSelector } from "reselect";
import get from "lodash/fp/get";
import orderBy from "lodash/fp/orderBy";

const proposals = get(["proposalBilling", "proposals"]);

export const proposalsBilled = createSelector(
  proposals,
  (proposals = {}) => Object.values(proposals),
  orderBy(["totalbilled"], ["desc"])
);

export const proposalBillingDetails = (token) =>
  createSelector(proposals, (proposals = {}) => {
    return proposals[token];
  });
