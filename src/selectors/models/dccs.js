import { createSelector } from "reselect";
import get from "lodash/fp/get";
import orderBy from "lodash/fp/orderBy";
import { currentUserID } from "./users";

export const dccsByToken = get(["dccs", "byToken"]);
export const allDccsTokens = get(["dccs", "all"]);
export const dccsByStatus = get(["dccs", "byStatus"]);
export const newDccToken = get(["dccs", "newDccToken"]);
const sortByNewestFirst = orderBy(["timestamp"], ["desc"]);

export const allDccs = createSelector(
  allDccsTokens,
  dccsByToken,
  (tokens, invByToken) => {
    return sortByNewestFirst(tokens.map((token) => invByToken[token]));
  }
);

export const makeGetDccsByUserID = (userID) =>
  createSelector(allDccs, (dccs) =>
    dccs.filter((inv) => inv.userid === userID)
  );

export const getCurrentUserDccs = createSelector(
  allDccs,
  currentUserID,
  (dccs, currUserID) => {
    return dccs.filter((inv) => inv.userid === currUserID);
  }
);

export const makeGetDccByToken = (token) =>
  createSelector(dccsByToken, get(token));
