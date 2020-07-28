import { createSelector } from "reselect";
import get from "lodash/fp/get";
import orderBy from "lodash/fp/orderBy";

const proposals = get(["proposalBilling", "proposalsList"]);
const details = get(["proposalBilling", "proposalDetails"]);

export const proposalsBilled = createSelector(proposals, (proposals) =>
  proposals ? orderBy(["totalbilled"], ["desc"], proposals) : null
);

export const proposalBillingDetails = details;
