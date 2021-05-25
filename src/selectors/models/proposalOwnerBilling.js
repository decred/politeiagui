import { createSelector } from "reselect";
import get from "lodash/fp/get";
import { shortRecordToken } from "src/helpers";

const proposalOwnerBillingByToken = get([
  "proposalOwnerBilling",
  "byProposalToken"
]);

export const makeGetBillingInfoByToken = (token) =>
  createSelector(proposalOwnerBillingByToken, get(shortRecordToken(token)));
