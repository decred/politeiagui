import { createSelectorCreator, defaultMemoize } from "reselect";
import isEqual from "lodash/isEqual";
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

// create a "selector creator" that uses lodash.isEqual instead of ===
export const createDeepEqualSelector = createSelectorCreator(
  defaultMemoize,
  isEqual
);

// this function maps the emailnotifications user property received from
// the server to our UI preferences presentation
export const emailNotificationsToPreferences = emailnotifications => ({
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
