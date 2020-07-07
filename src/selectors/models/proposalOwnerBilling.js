import { createSelector } from "reselect";
import get from "lodash/fp/get";

const proposalOwnerBillingByToken = get([
  "proposalOwnerBilling",
  "byProposalToken"
]);

export const getBillingInfo = (state) => (token) => {
  console.log(token);
  console.log(state);
};

export const makeGetBillingInfoByToken = (token) =>
  createSelector(proposalOwnerBillingByToken, get(token));
