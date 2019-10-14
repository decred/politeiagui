import { createSelector } from "reselect";
import get from "lodash/fp/get";

export const proposalsByToken = get(["proposals", "byToken"]);

export const makeGetProposalByToken = token =>
  createSelector(
    proposalsByToken,
    get(token)
  );
