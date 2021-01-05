import { createSelector } from "reselect";
import get from "lodash/fp/get";

export const codeStatsByUserID = get(["codestats", "byUserID"]);
export const userCodeStats = (userID) =>
  createSelector(codeStatsByUserID, get(userID));

export const makeGetCodeStatsByUserID = (userID, start, end) =>
  createSelector(userCodeStats(userID), (userCodeStats) =>
    userCodeStats ? userCodeStats[`${start}${end}`] : null
  );
