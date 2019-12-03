import { createSelector } from "reselect";
import { emailNotificationsToPreferences } from "../helpers";
import get from "lodash/fp/get";

export const userByID = get(["users", "byID"]);
export const searchResultsByID = get(["users", "search", "resultsByID"]);
export const queryResultsByEmail = get(["users", "search", "queryByEmail"]);
export const queryResultsByUsername = get([
  "users",
  "search",
  "queryByUsername"
]);

export const makeGetUserByID = userID =>
  createSelector(userByID, users => users[userID] || null);

export const currentUserID = get(["users", "currentUserID"]);

export const currentUser = createSelector(
  userByID,
  currentUserID,
  (users, userID) => users[userID]
);

const createUserSelectors = keys =>
  keys.map(key => createSelector(currentUser, user => user && user[key]));

export const [
  currentUserEmail,
  currentUserUsername,
  currentUserLastLoginTime,
  currentUserIsAdmin,
  currentUserSessionMaxAge,
  currentUserPublicKey,
  currentUserPaywallAddress,
  currentUserPaywallTxid,
  currentUserPaywallTxNotBefore
] = createUserSelectors([
  "email",
  "username",
  "lastlogintime",
  "isadmin",
  "sessionmaxage",
  "publickey",
  "paywalladdress",
  "paywalltxid",
  "paywalltxnotbefore"
]);

export const currentUserPaywallAmount = createSelector(
  currentUser,
  user => user && user.paywallamount / 100000000
);

export const currentUserPreferences = createSelector(
  currentUser,
  user => user && emailNotificationsToPreferences(user.emailnotifications)
);

export const makeGetSearchResultsByEmail = email =>
  createSelector(
    searchResultsByID,
    queryResultsByEmail,
    (allResults, idsByEmail) => {
      const results = idsByEmail[email];
      if (!results) return null;
      return results.map(id => allResults[id]);
    }
  );

export const makeGetSearchResultsByUsername = username =>
  createSelector(
    searchResultsByID,
    queryResultsByUsername,
    (allResults, idsByUsn) => {
      const results = idsByUsn[username];
      if (!results) return null;
      return results.map(id => allResults[id]);
    }
  );
