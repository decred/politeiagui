import { createSelector } from "reselect";
import { emailNotificationsToPreferences } from "../helpers";
import get from "lodash/fp/get";

export const userByID = get(["users", "byID"]);

export const makeGetUserByID = userID =>
  createSelector(
    userByID,
    users => users[userID] || null
  );

export const currentUserID = get(["users", "currentUserID"]);

export const currentUser = createSelector(
  userByID,
  currentUserID,
  (users, userID) => users[userID]
);

const createUserSelectors = keys =>
  keys.map(key =>
    createSelector(
      currentUser,
      user => user && user[key]
    )
  );

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
