import { createSelector } from "reselect";
import get from "lodash/fp/get";
import {
  NOTIFICATION_EMAIL_MY_PROPOSAL_STATUS_CHANGE,
  NOTIFICATION_EMAIL_MY_PROPOSAL_VOTE_STARTED,
  NOTIFICATION_EMAIL_ADMIN_PROPOSAL_NEW,
  NOTIFICATION_EMAIL_ADMIN_PROPOSAL_VOTE_AUTHORIZED,
  NOTIFICATION_EMAIL_REGULAR_PROPOSAL_VETTED,
  NOTIFICATION_EMAIL_REGULAR_PROPOSAL_EDITED,
  NOTIFICATION_EMAIL_REGULAR_PROPOSAL_VOTE_STARTED,
  NOTIFICATION_EMAIL_COMMENT_ON_MY_PROPOSAL,
  NOTIFICATION_EMAIL_COMMENT_ON_MY_COMMENT
} from "src/constants";

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
  user => emailNotificationsToPreferences(user.emailnotifications)
);

const emailNotificationsToPreferences = emailnotifications => ({
  "myproposalnotifications-statuschange": !!(
    emailnotifications & NOTIFICATION_EMAIL_MY_PROPOSAL_STATUS_CHANGE
  ),
  "myproposalnotifications-votestarted": !!(
    emailnotifications & NOTIFICATION_EMAIL_MY_PROPOSAL_VOTE_STARTED
  ),
  "regularproposalnotifications-vetted": !!(
    emailnotifications & NOTIFICATION_EMAIL_REGULAR_PROPOSAL_VETTED
  ),
  "regularproposalnotifications-edited": !!(
    emailnotifications & NOTIFICATION_EMAIL_REGULAR_PROPOSAL_EDITED
  ),
  "regularproposalnotifications-votestarted": !!(
    emailnotifications & NOTIFICATION_EMAIL_REGULAR_PROPOSAL_VOTE_STARTED
  ),
  "adminproposalnotifications-new": !!(
    emailnotifications & NOTIFICATION_EMAIL_ADMIN_PROPOSAL_NEW
  ),
  "adminproposalnotifications-voteauthorized": !!(
    emailnotifications & NOTIFICATION_EMAIL_ADMIN_PROPOSAL_VOTE_AUTHORIZED
  ),
  "commentnotifications-proposal": !!(
    emailnotifications & NOTIFICATION_EMAIL_COMMENT_ON_MY_PROPOSAL
  ),
  "commentnotifications-comment": !!(
    emailnotifications & NOTIFICATION_EMAIL_COMMENT_ON_MY_COMMENT
  )
});
