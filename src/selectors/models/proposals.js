import { createSelector } from "reselect";
import get from "lodash/fp/get";
import keys from "lodash/keys";
import { isEmpty } from "src/helpers";
import { shortRecordToken } from "src/helpers";
import { createDeepEqualSelector } from "../helpers";

export const proposalsByToken = get(["proposals", "byToken"]);
export const proposalSummariesByToken = get(["proposals", "summaries"]);
export const legacyProposals = get(["proposals", "legacyProposals"]);
export const allProposalsByUserID = get(["proposals", "allProposalsByUserId"]);
export const allTokensByUserID = get(["proposals", "allTokensByUserId"]);
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
  createSelector(
    proposalsByToken,
    (propsByToken) => propsByToken[shortRecordToken(token)]
  );

export const makeGetProposalSummaryByToken = (token) =>
  createSelector(proposalSummariesByToken, (summaries) => {
    const tokenFromSummary = keys(summaries).find(
      (s) => shortRecordToken(s) === shortRecordToken(token)
    );
    return summaries[tokenFromSummary];
  });

export const makeGetUserProposalsTokens = (userId) =>
  createSelector(allTokensByUserID, get(userId));

export const makeGetNumOfProposalsByUserId = (userId) =>
  createSelector(numOfProposalsByUserId, get(userId));

// changed this selector to keep the order in which the proposals are fetched. Old approach was messing with RFPs previously fetched.
export const makeGetUserProposals = (userId) =>
  createSelector(allProposalsByUserID, (props) => {
    return isEmpty(props) ? [] : props[userId];
  });

export const makeGetProposalName = (token) =>
  createSelector(makeGetProposalByToken(shortRecordToken(token)), (proposal) =>
    proposal ? proposal.name : null
  );
