import { createSelector } from "reselect";
import get from "lodash/fp/get";
import compose from "lodash/fp/compose";
import { or, bool } from "../lib/fp";

export const getIsApiRequesting = (key) =>
  bool(get(["api", key, "isRequesting"]));
export const getApiPayload = (key) => get(["api", key, "payload"]);
export const getApiError = (key) => get(["api", key, "error"]);

// Politeia Selectors
const isApiRequestingProposal = getIsApiRequesting("proposal");
export const isApiRequestingInit = getIsApiRequesting("init");
export const isApiRequestingPolicy = getIsApiRequesting("policy");
export const isApiRequestingUserProposals = getIsApiRequesting("userProposals");
export const isApiRequestingUser = getIsApiRequesting("user");
export const isApiRequestingPropVoteResults = getIsApiRequesting(
  "proposalVoteResults"
);
export const isApiRequestingProposalsVoteSummary = getIsApiRequesting(
  "proposalsVoteSummary"
);
export const isApiRequestingEditUser = getIsApiRequesting("editUser");
export const isApiRequestingProposalPaywall = getIsApiRequesting(
  "proposalPaywallDetails"
);
export const isApiRequestingUserProposalCredits = getIsApiRequesting(
  "userProposalCredits"
);
export const isApiRequestingLikeComment = get([
  "api",
  "likeComment",
  "isRequesting"
]);
export const proposalIsRequesting = or(
  isApiRequestingInit,
  isApiRequestingProposal
);
export const isApiRequestingRescanUserPayments = getIsApiRequesting(
  "rescanUserPayments"
);
export const isApiRequestingComments = or(
  getIsApiRequesting("proposalComments"),
  getIsApiRequesting("invoiceComments")
);
export const isApiRequestingCommentsLikes = getIsApiRequesting("commentslikes");
export const isApiRequestingManageUser = getIsApiRequesting("manageUser");
const apiManageUserPayload = getApiPayload("manageUser");
export const manageUserAction = compose(get("action"), apiManageUserPayload);
export const makeIsApiRequestingManageUserByAction = (action) =>
  createSelector(
    (state) =>
      isApiRequestingManageUser(state) && manageUserAction(state) === action
  );

export const apiPropVoteStatusError = getApiError("proposalVoteStatusError");
export const updateUserKeyError = getApiError("updateUserKey");
export const verifyUserKeyError = getApiError("verifyUserKey");
export const editUserError = getApiError("editUser");
export const apiInitError = getApiError("init");
const apiUserProposalsError = getApiError("userProposals");
const apiProposalError = getApiError("proposal");
export const apiPropsVoteSummaryError = getApiError(
  "proposalsVoteSummaryError"
);
export const userProposalsError = or(apiInitError, apiUserProposalsError);
export const apiProposalsBatchError = getApiError("proposalsBatch");
export const proposalError = or(apiInitError, apiProposalError);
export const apiRescanUserPaymentsError = getApiError("rescanUserPayments");

// CMS Selectors
export const isApiRequestingInvoicePayouts = getIsApiRequesting(
  "invoicePayouts"
);
