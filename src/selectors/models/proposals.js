import { createSelector } from "reselect";
import get from "lodash/fp/get";

export const proposalsByToken = createSelector(get(["proposals", "byToken"]));

export const makeGetProposalByToken = token =>
  createSelector(
    proposalsByToken,
    get(token)
  );
