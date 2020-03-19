import qs from "query-string";
import { userAlreadyPaid, getKeyMismatch, isCMS, apiDCCComments } from "./api";
import {
  PAYWALL_STATUS_PAID,
  PAYWALL_STATUS_WAITING,
  NOTIFICATION_EMAIL_MY_PROPOSAL_STATUS_CHANGE,
  NOTIFICATION_EMAIL_MY_PROPOSAL_VOTE_STARTED,
  NOTIFICATION_EMAIL_ADMIN_PROPOSAL_NEW,
  NOTIFICATION_EMAIL_ADMIN_PROPOSAL_VOTE_AUTHORIZED,
  NOTIFICATION_EMAIL_REGULAR_PROPOSAL_VETTED,
  NOTIFICATION_EMAIL_REGULAR_PROPOSAL_EDITED,
  NOTIFICATION_EMAIL_REGULAR_PROPOSAL_VOTE_STARTED,
  NOTIFICATION_EMAIL_COMMENT_ON_MY_PROPOSAL,
  NOTIFICATION_EMAIL_COMMENT_ON_MY_COMMENT,
  CMS_PAYWALL_STATUS
} from "../constants";

export const draftProposals = (state) =>
  state && state.app && state.app.draftProposals;

export const draftInvoices = (state) =>
  state && state.app && state.app.draftInvoices;
export const draftInvoiceById = (state) => {
  const drafts = draftInvoices(state);
  const { draftid } = qs.parse(window.location.search);
  return (draftid && drafts && drafts[draftid]) || false;
};
export const getUserAlreadyPaid = (state) => state.app.userAlreadyPaid;

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

export const getUserPaywallStatus = (state) => {
  if (isCMS(state)) return CMS_PAYWALL_STATUS;
  if (userAlreadyPaid(state)) {
    return PAYWALL_STATUS_PAID;
  }

  return state.app.userPaywallStatus || PAYWALL_STATUS_WAITING;
};
export const getUserPaywallConfirmations = (state) => {
  if (userAlreadyPaid(state)) {
    return null;
  }
  return state.app.userPaywallConfirmations;
};

export const getUserPaywallTxid = (state) => {
  if (userAlreadyPaid(state)) {
    return null;
  }
  return state.app.userPaywallTxid;
};

export const userHasPaid = (state) => {
  return getUserPaywallStatus(state) === PAYWALL_STATUS_PAID;
};
export const userCanExecuteActions = (state) => {
  return userHasPaid(state) && !getKeyMismatch(state);
};

export const dccComments = (state) => apiDCCComments(state);

export const getCsrfIsNeeded = (state) =>
  state.app ? state.app.csrfIsNeeded : null;

export const shouldAutoVerifyKey = (state) => state.app.shouldVerifyKey;

export const identityImportError = (state) =>
  state.app.identityImportResult && state.app.identityImportResult.errorMsg;

export const identityImportSuccess = (state) =>
  state.app.identityImportResult && state.app.identityImportResult.successMsg;

export const pollingCreditsPayment = (state) => state.app.pollingCreditsPayment;

export const reachedCreditsPaymentPollingLimit = (state) =>
  state.app.reachedCreditsPaymentPollingLimit;

export const proposalPaymentReceived = (state) =>
  state.app.proposalPaymentReceived;
