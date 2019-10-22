import { createSelector } from "reselect";
import get from "lodash/fp/get";
import orderBy from "lodash/fp/orderBy";

export const proposalsByToken = get(["proposals", "byToken"]);
export const allProposalsByUserID = get(["proposals", "allProposalsByUserId"]);

export const makeGetProposalByToken = token =>
  createSelector(
    proposalsByToken,
    get(token)
  );

export const makeGetUserProposals = userId =>
  createSelector(
    allProposalsByUserID,
    proposalsByToken,
    (propsByUserID, propsByToken) => {
      const userProps = (propsByUserID[userId] || [])
        .map(token => propsByToken[token])
        .filter(Boolean);
      const sortByNewestFirst = orderBy(["timestamp"], ["desc"]);
      return sortByNewestFirst(userProps);
    }
  );
