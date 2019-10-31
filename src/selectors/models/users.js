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
  user => user && user.lastlogintime
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
