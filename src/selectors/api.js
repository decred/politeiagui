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
export const isApiRequestingBatchProposalSummary = getIsApiRequesting(
  "batchProposalSummary"
);
export const isApiRequestingVotesDetails = getIsApiRequesting("votesDetails");
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
export const isApiRequestingVoteSummary = or(
  isApiRequestingProposalsVoteSummary,
  isApiRequestingPropVoteResults,
  isApiRequestingVotesDetails
);
export const isApiRequestingRescanUserPayments =
  getIsApiRequesting("rescanUserPayments");

export const isApiRequestingProposalOwnerBilling = getIsApiRequesting(
  "proposalOwnerBilling"
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

export const updateUserKeyError = getApiError("updateUserKey");
export const verifyUserKeyError = getApiError("verifyUserKey");
export const editUserError = getApiError("editUser");
export const apiInitError = getApiError("init");
export const propVoteResultsError = getApiError("proposalVoteResults");
const apiUserProposalsError = getApiError("userProposals");
const apiProposalError = getApiError("proposal");
export const apiPropsVoteSummaryError = getApiError(
  "proposalsVoteSummaryError"
);
export const userProposalsError = or(apiInitError, apiUserProposalsError);
export const apiProposalsBatchError = getApiError("proposalsBatch");
export const proposalError = or(apiInitError, apiProposalError);
export const apiRescanUserPaymentsError = getApiError("rescanUserPayments");
export const apiProposalCommentsError = getApiError("proposalComments");
export const apiInvoiceCommentsError = getApiError("invoiceComments");
export const apiDccCommentsError = getApiError("dccComments");
export const apiLikeCommentsError = getApiError("likeComment");
export const apiCommentsLikesError = getApiError("commentslikes");

// CMS Selectors
export const isApiRequestingInvoicePayouts =
  getIsApiRequesting("invoicePayouts");

export const isApiRequestingProposalBillingSummary =
  getIsApiRequesting("spendingSummary");

export const isApiRequestingProposalBillingDetails =
  getIsApiRequesting("spendingDetails");
