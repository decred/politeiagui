import { createSelector } from "reselect";
import get from "lodash/fp/get";
import orderBy from "lodash/fp/orderBy";
import { createDeepEqualSelector } from "../helpers";

export const proposalsByToken = get(["proposals", "byToken"]);
export const legacyProposals = get(["proposals", "legacyProposals"]);
export const allProposalsByUserID = get(["proposals", "allProposalsByUserId"]);
export const numOfProposalsByUserId = get([
  "proposals",
  "numOfProposalsByUserId"
]);
export const allByVoteStatus = createDeepEqualSelector(
  get(["proposals"]),
  ({ allByVoteStatus }) => allByVoteStatus
);

export const allByRecordStatus = createDeepEqualSelector(
  get(["proposals"]),
  ({ allByRecordStatus }) => allByRecordStatus
);

export const tokenInventory = createDeepEqualSelector(
  get(["api"]),
  ({ tokenInventory }) => tokenInventory.payload
);
export const newProposalToken = get(["proposals", "newProposalToken"]);

export const makeGetProposalByToken = (token) =>
  createSelector(proposalsByToken, (propsByToken) => {
    const proposal = propsByToken[token];
    if (proposal) return proposal;
    const proposalsTokens = Object.keys(propsByToken);
    // check if the provided token is prefix of original token
    const matchedTokenByPrefix = proposalsTokens.find(
      (key) => key.substring(0, 7) === token
    );
    return propsByToken[matchedTokenByPrefix];
  });

export const makeGetNumOfProposalsByUserId = (userId) =>
  createSelector(numOfProposalsByUserId, get(userId));

export const makeGetUserProposals = (userId) =>
  createSelector(
    allProposalsByUserID,
    proposalsByToken,
    (propsByUserID = {}, propsByToken) => {
      const userProps = (propsByUserID[userId] || [])
        .map((token) => propsByToken[token])
        .filter(Boolean);
      const sortByNewestFirst = orderBy(["timestamp"], ["desc"]);
      return sortByNewestFirst(userProps);
    }
  );

export const makeGetProposalName = (token) =>
  createSelector(makeGetProposalByToken(token), (proposal) =>
    proposal ? proposal.name : null
  );
