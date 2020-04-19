import { createSelector } from "reselect";
import get from "lodash/fp/get";
import compose from "lodash/fp/compose";
import { or, bool, constant, not } from "../lib/fp";
import { CMSWWWMODE } from "../constants";

export const getIsApiRequesting = (key) =>
  bool(get(["api", key, "isRequesting"]));
export const getApiPayload = (key) => get(["api", key, "payload"]);
export const getApiResponse = (key) => get(["api", key, "response"]);
export const getApiError = (key) => get(["api", key, "error"]);

export const isApiRequestingInit = getIsApiRequesting("init");
export const isApiRequestingUnvettedStatus = getIsApiRequesting(
  "unvettedStatus"
);
export const isApiRequestingMe = getIsApiRequesting("me");
export const isApiRequestingPolicy = getIsApiRequesting("policy");
export const isApiRequestingNewUser = getIsApiRequesting("newUser");
export const isApiRequestingChangePassword = getIsApiRequesting(
  "changePassword"
);
export const isApiRequestingChangeUsername = getIsApiRequesting(
  "changeUsername"
);
export const isApiRequestingVerifyNewUser = getIsApiRequesting("verifyNewUser");
export const isApiRequestingLogin = getIsApiRequesting("login");
export const isApiRequestingLogout = getIsApiRequesting("logout");
export const isApiRequestingForgottenPassword = getIsApiRequesting(
  "forgottenPassword"
);
export const isApiRequestingResendVerificationEmail = getIsApiRequesting(
  "resendVerificationEmail"
);
export const isApiRequestingPasswordReset = getIsApiRequesting("passwordReset");
export const isApiRequestingUnvetted = getIsApiRequesting("unvetted");
const isApiRequestingUserProposals = getIsApiRequesting("userProposals");
const isApiRequestingProposal = getIsApiRequesting("proposal");
export const isApiRequestingUserSearch = getIsApiRequesting("userSearch");
export const isApiRequestingUser = getIsApiRequesting("user");
export const isApiRequestingNewComment = getIsApiRequesting("newComment");
export const isApiRequestingSetStatusProposal = getIsApiRequesting(
  "setStatusProposal"
);

export const isApiRequestingPropVoteResults = getIsApiRequesting(
  "proposalVoteResults"
);
export const proposalVoteResultsError = getApiError("proposalVoteResults");

export const isApiRequestingProposalsVoteSummary = getIsApiRequesting(
  "proposalsVoteSummary"
);
export const isApiRequestingEditUser = getIsApiRequesting("editUser");
export const isApiRequestingManageUser = getIsApiRequesting("manageUser");

export const makeIsApiRequestingManageUserByAction = (action) =>
  createSelector(
    (state) =>
      isApiRequestingManageUser(state) && manageUserAction(state) === action
  );

export const isApiRequestingEditProposal = getIsApiRequesting("editProposal");
export const isApiRequestingEditInvoice = getIsApiRequesting("editInvoice");

const apiSetStatusProposalPayload = getApiPayload("setStatusProposal");
const apiManageUserPayload = getApiPayload("manageUser");

export const apiMeResponse = getApiResponse("me");
export const apiUnvettedStatusResponse = getApiResponse("unvettedStatus");
export const apiInitResponse = getApiResponse("init");
const apiPolicyResponse = getApiResponse("policy");
export const apiNewUserResponse = getApiResponse("newUser");
export const apiUserResponse = getApiResponse("user");
export const apiChangePasswordResponse = getApiResponse("changePassword");
export const apiChangeUsernameResponse = getApiResponse("changeUsername");
export const apiLoginResponse = getApiResponse("login");
export const forgottenPasswordResponse = getApiResponse("forgottenPassword");
export const resendVerificationEmailResponse = getApiResponse(
  "resendVerificationEmail"
);
export const passwordResetResponse = getApiResponse("passwordReset");
export const verifyResetPasswordResponse = getApiResponse(
  "verifyResetPassword"
);
export const apiVettedResponse = getApiResponse("vetted");
const apiProposalResponse = getApiResponse("proposal");

const apiNewProposalResponse = getApiResponse("newProposal");
const apiNewInvoiceResponse = getApiResponse("newInvoice");
const apiSetStatusProposalResponse = getApiResponse("setStatusProposal");
export const apiUserSearchResponse = getApiResponse("userSearch");
export const verifyNewUser = getApiResponse("verifyNewUser");
export const updateUserKey = getApiResponse("updateUserKey");
export const verifyUserKey = getApiResponse("verifyUserKey");
export const updateUserKeyError = getApiError("updateUserKey");
export const verifyUserKeyError = getApiError("verifyUserKey");
export const apiEditUserPayload = getApiPayload("editUser");
export const apiEditUserResponse = getApiResponse("editUser");
export const editUserError = getApiError("editUser");

export const apiPropVoteResultsResponse = getApiResponse("proposalVoteResults");

const apiProposalPaywallDetailsResponse = getApiResponse(
  "proposalPaywallDetails"
);
export const proposalPaywallAddress = compose(
  get("paywalladdress"),
  apiProposalPaywallDetailsResponse
);
export const proposalCreditPrice = (state) => {
  let creditPrice = 0;
  if (
    state.api.proposalPaywallDetails &&
    state.api.proposalPaywallDetails.response
  ) {
    creditPrice = state.api.proposalPaywallDetails.response.creditprice;
  }

  // Amount returned from the server is in atoms, so convert to dcr.
  return creditPrice / 100000000;
};

export const isApiRequestingProposalPaywall = getIsApiRequesting(
  "proposalPaywallDetails"
);
export const proposalPaywallError = getApiError("proposalPaywallDetails");

export const isApiRequestingUserProposalCredits = getIsApiRequesting(
  "userProposalCredits"
);
export const isApiRequestingLikeComment = get([
  "api",
  "likeComment",
  "isRequesting"
]);

export const apiInitError = getApiError("init");

const apiUserProposalsError = getApiError("userProposals");

const apiProposalError = getApiError("proposal");

export const csrf = compose(get("csrfToken"), apiInitResponse);

export const getUserUsername = or(
  compose(get("username"), apiChangeUsernameResponse),
  compose(get("username"), apiUserResponse)
);

export const isAdmin = bool(
  or(
    compose(get("isadmin"), apiMeResponse),
    compose(get("isadmin"), apiLoginResponse)
  )
);

export const userAlreadyPaid = bool((state) => {
  if (state.api.me && state.api.me.response) {
    return state.api.me.response.paywalladdress === "";
  }
  if (state.api.login && state.api.login.response) {
    return state.api.login.response.paywalladdress === "";
  }

  return false;
});

export const isTestNet = compose(get("testnet"), apiInitResponse);
export const isMainNet = not(isTestNet);

export const apiPropsVoteSummaryError = getApiError(
  "proposalsVoteSummaryError"
);

export const userid = (state) =>
  (state.api.me.response && state.api.me.response.userid) ||
  (state.api.login.response && state.api.login.response.userid);

export const policy = apiPolicyResponse;

export const userProposalsIsRequesting = isApiRequestingUserProposals;
export const userProposalsError = or(apiInitError, apiUserProposalsError);

export const apiProposal = compose(get("proposal"), apiProposalResponse);

export const proposalToken = compose(
  get(["censorshiprecord", "token"]),
  apiProposal
);

export const proposalName = compose(get(["name"]), apiProposal);

export const apiProposalsBatchError = getApiError("proposalsBatch");

export const proposalIsRequesting = or(
  isApiRequestingInit,
  isApiRequestingProposal
);

export const proposalError = or(apiInitError, apiProposalError);

export const newProposalToken = compose(
  get(["censorshiprecord", "token"]),
  apiNewProposalResponse
);

export const newInvoiceToken = compose(
  get(["censorshiprecord", "token"]),
  apiNewInvoiceResponse
);

export const setStatusProposal = compose(
  get("status"),
  apiSetStatusProposalResponse
);
export const setStatusProposalIsRequesting = isApiRequestingSetStatusProposal;
export const setStatusProposalToken = compose(
  get("token"),
  apiSetStatusProposalPayload
);
export const setStatusProposalStatus = compose(
  get("status"),
  apiSetStatusProposalPayload
);

export const verificationToken = compose(
  get("verificationtoken"),
  apiNewUserResponse
);
export const getKeyMismatch = (state) => state.api.keyMismatch;
export const manageUserAction = compose(get("action"), apiManageUserPayload);

export const visitedProposal = compose(
  get("accesstime"),
  getApiResponse("proposalComments")
);

export const apiProposalPaywallPaymentResponse = getApiResponse(
  "proposalPaywallPayment"
);
export const apiProposalPaywallPaymentError = getApiError(
  "proposalPaywallPayment"
);
export const apiProposalPaywallPaymentTxid = compose(
  get("txid"),
  apiProposalPaywallPaymentResponse
);
export const apiProposalPaywallPaymentAmount = compose(
  get("amount"),
  apiProposalPaywallPaymentResponse
);
export const apiProposalPaywallPaymentConfirmations = compose(
  get("confirmations"),
  apiProposalPaywallPaymentResponse
);
export const isApiRequestingUpdateUserKey = getIsApiRequesting("updateUserKey");

const rescanUserPaymentsKey = "rescanUserPayments";
export const apiRescanUserPaymentsResponse = getApiResponse(
  rescanUserPaymentsKey
);
export const apiRescanUserPaymentsUserId = getApiPayload(rescanUserPaymentsKey);
export const apiRescanUserPaymentsError = getApiError(rescanUserPaymentsKey);
export const isApiRequestingRescanUserPayments = getIsApiRequesting(
  rescanUserPaymentsKey
);
export const apiRescanUserPaymentsNewCredits = compose(
  get("newcredits"),
  apiRescanUserPaymentsResponse
);

export const amountOfCreditsAddedOnRescan = (state) => {
  const newCredits = apiRescanUserPaymentsNewCredits(state);
  return newCredits && newCredits.length;
};

export const resetPasswordResponse = getApiResponse("resetPassword");

export const isApiRequestingComments = or(
  getIsApiRequesting("proposalComments"),
  getIsApiRequesting("invoiceComments")
);

export const isApiRequestingCommentsLikes = getIsApiRequesting("commentslikes");

// CMS Selectors
const mode = compose(get("mode"), apiInitResponse);

export const isCMS = (state) => mode(state) === CMSWWWMODE;

export const generatePayoutsResponse = getApiResponse("payouts");
export const generatePayoutsError = getApiError("payouts");
export const isApiRequestingGeneratePayouts = getIsApiRequesting("payouts");
export const payouts = compose(get("payouts"), generatePayoutsResponse);

export const manageCmsUserResponse = getApiResponse("manageCmsUser");
export const manageCmsUserError = getApiError("manageCmsUser");

export const userSubcontractors = compose(
  get("users"),
  getApiResponse("userSubcontractors")
);

export const invoicePayoutsResponse = getApiResponse("invoicePayouts");
export const invoicePayoutsError = getApiError("invoicePayouts");
export const isApiRequestingInvoicePayouts = getIsApiRequesting(
  "invoicePayouts"
);
export const invoicePayouts = compose(get("invoices"), invoicePayoutsResponse);

// TODO: Use createSelector instead of compose once we refactor the CMS connectors
// b/c the createSelector doesn't work properly whe used in combination with the selectorMap
export const lineItemPayouts = compose(
  (lineItems) => lineItems.sort((a, b) => a.timestamp - b.timestamp),
  (invoices = []) =>
    invoices.reduce((lineItems, invoice) => {
      return lineItems.concat(
        invoice.input.lineitems.map((lineItem) => ({
          ...lineItem,
          timestamp: invoice.timestamp,
          token: invoice.censorshiprecord.token,
          labor: (lineItem.labor / 60) * (invoice.input.contractorrate / 100),
          expenses: lineItem.expenses / 100,
          description: lineItem.description.replace(/#/g, ""),
          month: invoice.input.month,
          year: invoice.input.year,
          paiddate: new Date(
            invoice.payment.timelastupdated * 1000
          ).toLocaleString(),
          amountreceived: invoice.payment.amountreceived / 100000000
        }))
      );
    }, []),
  invoicePayouts
);

export const apiNewDccResponse = getApiResponse("newDcc");
export const newDccError = getApiError("newDcc");
export const isApiRequestingNewDcc = getIsApiRequesting("newDcc");

export const newDccToken = compose(
  get(["censorshiprecord", "token"]),
  apiNewDccResponse
);

export const apiDCCsResponse = getApiResponse("dccs");
export const dccsError = getApiError("dccs");

export const dccDetailsApi = getApiResponse("dcc");

export const dcc = compose(get("dcc"), dccDetailsApi);

export const dccToken = compose(get(["censorshiprecord", "token"]), dcc);

export const apiSupportOpposeDCCError = getApiError("supportOpposeDCC");
export const apiSetDCCStatusError = getApiError("setDCCStatus");

const apiDCCCommentsResponse = getApiResponse("dccComments");
export const apiDCCComments = or(
  compose(get("comments"), apiDCCCommentsResponse),
  constant([])
);

export const apiDCCCommentsError = or(
  getApiError("dccComments"),
  getApiError("newComment")
);
