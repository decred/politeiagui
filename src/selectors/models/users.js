import { createSelector } from "reselect";
import get from "lodash/fp/get";

export const userByID = get(["users", "byID"]);

export const makeGetUserByID = userid =>
  createSelector(
    userByID,
    users => users[userid] || null
  );

export const me = get(["users", "me"]);

export const meEmail = get(["users", "me", "email"]);

export const meUsername = get(["users", "me", "username"]);

export const meUserID = get(["users", "me", "userid"]);

export const meLastLoginTime = get(["users", "me", "lastlogintime"]);

export const meIsAdmin = get(["users", "me", "isadmin"]);

export const meSessionMaxAge = get(["users", "me", "sessionmaxage"]);

export const mePublicKey = get(["users", "me", "pubkey"]);

export const mePaywallAddress = get(["users", "me", "paywalladdress"]);

export const mePaywallTxid = get(["users", "me", "paywalltxid"]);

export const mePaywallTxNotBefore = get(["users", "me", "paywalltxnotbefore"]);

export const mePaywallAmount = createSelector(
  get(["users", "me", "paywallAmount"]),
  amount => amount / 100000000
);

export const meAlreadyPaid = createSelector(
  mePaywallAddress,
  address => address === ""
);
