import get from "lodash/fp/get";
import compose from "lodash/fp/compose";
import {
  CMSWWWMODE,
  NOTIFICATION_EMAIL_MY_PROPOSAL_STATUS_CHANGE,
  NOTIFICATION_EMAIL_MY_PROPOSAL_VOTE_STARTED,
  NOTIFICATION_EMAIL_ADMIN_PROPOSAL_NEW,
  NOTIFICATION_EMAIL_ADMIN_PROPOSAL_VOTE_AUTHORIZED,
  NOTIFICATION_EMAIL_REGULAR_PROPOSAL_VETTED,
  NOTIFICATION_EMAIL_REGULAR_PROPOSAL_EDITED,
  NOTIFICATION_EMAIL_REGULAR_PROPOSAL_VOTE_STARTED,
  NOTIFICATION_EMAIL_COMMENT_ON_MY_PROPOSAL,
  NOTIFICATION_EMAIL_COMMENT_ON_MY_COMMENT
} from "../constants";

export const init = get(["app", "init"]);

export const policy = get(["app", "policy"]);

export const csrf = compose(get("csrfToken"), init);

export const isTestNet = compose(get("testnet"), init);

const mode = compose(get("mode"), init);

export const isCMS = (state) => mode(state) === CMSWWWMODE;

export const keyMismatch = get(["app", "keyMismatch"]);

export const draftProposals = (state) =>
  state && state.app && state.app.draftProposals;

export const draftInvoices = (state) =>
  state && state.app && state.app.draftInvoices;

export const draftDccs = (state) => state && state.app && state.app.draftDccs;

export const resolveEditUserValues = (prefs) => {
  return {
    emailnotifications:
      (prefs["myproposalnotifications-statuschange"]
        ? NOTIFICATION_EMAIL_MY_PROPOSAL_STATUS_CHANGE
        : 0) |
      (prefs["myproposalnotifications-votestarted"]
        ? NOTIFICATION_EMAIL_MY_PROPOSAL_VOTE_STARTED
        : 0) |
      (prefs["regularproposalnotifications-vetted"]
        ? NOTIFICATION_EMAIL_REGULAR_PROPOSAL_VETTED
        : 0) |
      (prefs["regularproposalnotifications-edited"]
        ? NOTIFICATION_EMAIL_REGULAR_PROPOSAL_EDITED
        : 0) |
      (prefs["regularproposalnotifications-votestarted"]
        ? NOTIFICATION_EMAIL_REGULAR_PROPOSAL_VOTE_STARTED
        : 0) |
      (prefs["adminproposalnotifications-new"]
        ? NOTIFICATION_EMAIL_ADMIN_PROPOSAL_NEW
        : 0) |
      (prefs["adminproposalnotifications-voteauthorized"]
        ? NOTIFICATION_EMAIL_ADMIN_PROPOSAL_VOTE_AUTHORIZED
        : 0) |
      (prefs["commentnotifications-proposal"]
        ? NOTIFICATION_EMAIL_COMMENT_ON_MY_PROPOSAL
        : 0) |
      (prefs["commentnotifications-comment"]
        ? NOTIFICATION_EMAIL_COMMENT_ON_MY_COMMENT
        : 0)
  };
};

export const shouldAutoVerifyKey = (state) => state.app.shouldVerifyKey;

export const identityImportSuccess = (state) =>
  state.app.identityImportResult && state.app.identityImportResult.successMsg;

export const pollingCreditsPayment = (state) => state.app.pollingCreditsPayment;

export const reachedCreditsPaymentPollingLimit = (state) =>
  state.app.reachedCreditsPaymentPollingLimit;

export const proposalPaymentReceived = (state) =>
  state.app.proposalPaymentReceived;

export const isLoginRequired = get(["app", "loginRequired"]);
