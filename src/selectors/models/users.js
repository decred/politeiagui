import { createSelector } from "reselect";
import get from "lodash/fp/get";

export const userByID = get(["users", "byID"]);

export const makeGetUserByID = userid =>
  createSelector(
    userByID,
    users => users[userid] || null
  );

export const currentUserID = get(["users", "currentUserID"]);

export const currentUser = createSelector(
  userByID,
  currentUserID,
  (users, userid) => users[userid]
);

export const currentUserEmail = createSelector(
  currentUser,
  user => user && user.email
);

export const currentUserUsername = createSelector(
  currentUser,
  user => user && user.username
);

export const currentUserLastLoginTime = createSelector(
  currentUser,
  user => user && user.lastLoginTime
);

export const currentUserIsAdmin = createSelector(
  currentUser,
  user => user && user.isadmin
);

export const currentUserSessionMaxAge = createSelector(
  currentUser,
  user => user && user.email
);

export const currentUserPublicKey = createSelector(
  currentUser,
  user => user && user.publickey
);

export const currentUserPaywallAddress = createSelector(
  currentUser,
  user => user && user.paywalladdress
);

export const currentUserPaywallTxid = createSelector(
  currentUser,
  user => user && user.paywalltxid
);

export const currentUserPaywallTxNotBefore = createSelector(
  currentUser,
  user => user && user.paywalltxnotbefore
);

export const currentUserPaywallAmount = createSelector(
  currentUser,
  user => user && user.paywallAmount / 100000000
);

export const currentUserAlreadyPaid = createSelector(
  currentUserPaywallAddress,
  address => address === ""
);
