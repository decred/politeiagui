import get from "lodash/fp/get";
import compose from "lodash/fp/compose";
import eq from "lodash/fp/eq";
import filter from "lodash/fp/filter";
import find from "lodash/fp/find";
import { or, constant, not } from "../lib/fp";
import {
  apiProposal,
  proposalPayload,
  userAlreadyPaid,
  getKeyMismatch
} from "./api";
import { PAYWALL_STATUS_PAID, PAYWALL_STATUS_WAITING } from "../constants";

export const replyTo = or(get(["app", "replyParent"]), constant(0));

export const proposal = or((state) => {
  const payload = proposalPayload(state);
  const submittedProposals = state.app.submittedProposals;
  return submittedProposals[payload];
}, apiProposal, constant({}));

export const getLastSubmittedProposal = state => state.app.submittedProposals.lastSubmitted;
export const getAdminFilterValue = state => parseInt(state.app.adminProposalsShow, 10);
export const isMarkdown = compose(eq("index.md"), get("name"));
export const getProposalFiles = compose(get("files"), proposal);
export const getMarkdownFile = compose(find((isMarkdown)), getProposalFiles);
export const getNotMarkdownFile = compose(filter(not(isMarkdown)), getProposalFiles);

export const getUserPaywallStatus = state => {
  if(userAlreadyPaid(state)) {
    return PAYWALL_STATUS_PAID;
  }

  return state.app.userPaywallStatus || PAYWALL_STATUS_WAITING;
};
export const getUserPaywallConfirmations = state => {
  if(userAlreadyPaid(state)) {
    return null;
  }
  return state.app.userPaywallConfirmations;
};

export const userHasPaid = state => {
  return getUserPaywallStatus(state) === PAYWALL_STATUS_PAID;
};
export const userCanExecuteActions = state => {
  return userHasPaid(state) && !getKeyMismatch(state);
};

export const isProposalStatusApproved = state => state.app.isProposalStatusApproved;

export const activeVotesEndHeight = state => state.app.activeVotesEndHeight;
