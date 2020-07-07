import { createSelector } from "reselect";
import get from "lodash/fp/get";

const proposalOwnerBillingByToken = get([
  "proposalOwnerBilling",
  "byProposalToken"
]);

export const makeGetBillingInfoByToken = (token) =>
  createSelector(proposalOwnerBillingByToken, get(token));
