import { createSelector } from "reselect";
import get from "lodash/fp/get";

export const codeStatsByUserID = get(["codestats", "byUserID"]);

export const makeGetCodeStatsByUserID = (userID) =>
  createSelector(codeStatsByUserID, get(userID));
