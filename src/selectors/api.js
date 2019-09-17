import {
  createSelectorCreator,
  defaultMemoize,
  createSelector
} from "reselect";
import get from "lodash/fp/get";
import isEqual from "lodash/isEqual";
import eq from "lodash/fp/eq";
import filter from "lodash/fp/filter";
import compose from "lodash/fp/compose";
import { and, or, bool, constant, not } from "../lib/fp";
import {
  PROPOSAL_STATUS_UNREVIEWED,
  PROPOSAL_STATUS_CENSORED,
  PROPOSAL_STATUS_ABANDONED,
  CMSWWWMODE
} from "../constants";
// create a "selector creator" that uses lodash.isEqual instead of ===
const createDeepEqualSelector = createSelectorCreator(defaultMemoize, isEqual);

export const getIsApiRequesting = key =>
  bool(get(["api", key, "isRequesting"]));
export const getApiPayload = key => get(["api", key, "payload"]);
export const getApiResponse = key => get(["api", key, "response"]);
export const getApiError = key => get(["api", key, "error"]);

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
const isApiRequestingVetted = getIsApiRequesting("vetted");
export const isApiRequestingUnvetted = getIsApiRequesting("unvetted");
const isApiRequestingUserProposals = getIsApiRequesting("userProposals");
const isApiRequestingProposal = getIsApiRequesting("proposal");
const isApiRequestingNewProposal = getIsApiRequesting("newProposal");
const isApiRequestingNewInvoice = getIsApiRequesting("newInvoice");
const isApiRequestingInvoice = getIsApiRequesting("invoice");
export const isApiRequestingUserSearch = getIsApiRequesting("userSearch");
export const isApiRequestingUser = getIsApiRequesting("user");
export const isApiRequestingNewComment = getIsApiRequesting("newComment");
export const isApiRequestingSetStatusProposal = getIsApiRequesting(
  "setStatusProposal"
);
export const isApiRequestingPropsVoteStatus = getIsApiRequesting(
  "proposalsVoteStatus"
);
export const isApiRequestingPropVoteStatus = getIsApiRequesting(
  "proposalVoteStatus"
);
export const isApiRequestingPropVoteResults = getIsApiRequesting(
  "proposalVoteResults"
);
export const isApiRequestingProposalsBatch = getIsApiRequesting(
  "proposalsBatch"
);
export const isApiRequestingProposalsVoteSummary = getIsApiRequesting(
  "proposalsVoteSummary"
);
export const isApiRequestingEditUser = getIsApiRequesting("editUser");
export const isApiRequestingManageUser = getIsApiRequesting("manageUser");
export const isApiRequestingEditProposal = getIsApiRequesting("editProposal");
export const isApiRequestingEditInvoice = getIsApiRequesting("editInvoice");

const apiNewUserPayload = getApiPayload("newUser");
const apiLoginPayload = getApiPayload("login");
const apiForgottenPasswordPayload = getApiPayload("forgottenPassword");
const apiResendVerificationEmailPayload = getApiPayload(
  "resendVerificationEmail"
);
const apiNewProposalPayload = getApiPayload("newProposal");
const apiNewInvoicePayload = getApiPayload("newInvoice");
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
const apiUserProposalsResponse = getApiResponse("userProposals");
const apiUnvettedResponse = getApiResponse("unvetted");
const apiProposalResponse = getApiResponse("proposal");
const apiInvoiceResponse = getApiResponse("invoice");
const apiProposalCommentsResponse = getApiResponse("proposalComments");
const apiInvoiceCommentsResponse = getApiResponse("invoiceComments");
const apiNewProposalResponse = getApiResponse("newProposal");
const apiNewInvoiceResponse = getApiResponse("newInvoice");
const apiUserInvoicesResponse = getApiResponse("userInvoices");
export const userInvoicesError = getApiError("userInvoices");
const apiSetStatusProposalResponse = getApiResponse("setStatusProposal");
export const apiUserSearchResponse = getApiResponse("userSearch");
export const verifyNewUser = getApiResponse("verifyNewUser");
export const updateUserKey = getApiResponse("updateUserKey");
export const verifyUserKey = getApiResponse("verifyUserKey");
export const updateUserKeyError = getApiError("updateUserKey");
export const verifyUserKeyError = getApiError("verifyUserKey");
const apiCommentsLikesResponse = getApiResponse("commentslikes");
export const apiEditUserPayload = getApiPayload("editUser");
export const apiEditUserResponse = getApiResponse("editUser");
export const editUserError = getApiError("editUser");
export const manageUserResponse = getApiResponse("manageUser");

export const apiLikeCommentResponse = getApiResponse("likeComment");
export const apiLikeCommentError = getApiError("likeComment");
export const apiLikeCommentPayload = getApiPayload("likeComment");

export const apiPropsVoteStatusResponse = getApiResponse("proposalsVoteStatus");
export const apiPropsVoteStatusError = getApiError("proposalsVoteStatus");

export const apiPropVoteStatusResponse = getApiResponse("proposalVoteStatus");
export const apiPropVoteStatusError = getApiError("proposalVoteStatusError");

export const apiPropVoteResultsResponse = getApiResponse("proposalVoteResults");
export const apiPropVoteResultsError = getApiError("proposalVoteResultsError");

export const apiAuthorizeVoteResponse = getApiResponse("authorizeVote");
export const apiAuthorizeVotePayload = getApiPayload("authorizeVote");
export const apiAuthorizeVoteError = getApiError("authorizeVote");
export const isApiRequestingAuthorizeVote = getIsApiRequesting("authorizeVote");
export const apiAuthorizeVoteToken = compose(
  get("token"),
  apiAuthorizeVotePayload
);

export const apiStartVoteResponse = getApiResponse("startVote");
export const apiStartVotePayload = getApiPayload("startVote");
export const apiStartVoteError = getApiError("startVote");
export const isApiRequestingStartVote = getIsApiRequesting("startVote");
export const apiStartVoteToken = compose(
  get("token"),
  apiStartVotePayload
);

export const isApiRequestingSetProposalStatusByToken = state => token => {
  return (
    setStatusProposalIsRequesting(state) &&
    setStatusProposalToken(state) === token &&
    setStatusProposalStatus(state)
  );
};

const apiProposalPaywallDetailsResponse = getApiResponse(
  "proposalPaywallDetails"
);
export const proposalPaywallAddress = compose(
  get("paywalladdress"),
  apiProposalPaywallDetailsResponse
);
export const proposalCreditPrice = state => {
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
export const proposalPaywallTxNotBefore = compose(
  get("paywalltxnotbefore"),
  apiProposalPaywallDetailsResponse
);
export const isApiRequestingProposalPaywall = getIsApiRequesting(
  "proposalPaywallDetails"
);
export const proposalPaywallError = getApiError("proposalPaywallDetails");

export const isApiRequestingUpdateProposalCredits = getIsApiRequesting(
  "updateProposalCredits"
);
export const updateProposalCreditsError = getApiError("updateProposalCredits");
export const apiUserProposalCreditsResponse = getApiResponse(
  "userProposalCredits"
);
export const proposalCreditPurchases = state => {
  const r = apiUserProposalCreditsResponse(state);
  if (!r || !r.spentcredits || !r.unspentcredits) {
    return [];
  }

  const purchasesMap = {};
  [...r.spentcredits, ...r.unspentcredits].forEach(credit => {
    if (credit.txid in purchasesMap) {
      purchasesMap[credit.txid].numberPurchased++;
    } else {
      purchasesMap[credit.txid] = {
        price: credit.price / 100000000,
        datePurchased: credit.datepurchased,
        numberPurchased: 1,
        txId: credit.txid
      };
    }
  });

  return Object.values(purchasesMap).sort(
    (a, b) => a.datePurchased - b.datePurchased
  );
};
export const isApiRequestingUserProposalCredits = getIsApiRequesting(
  "userProposalCredits"
);
export const userProposalCreditsError = getApiError("userProposalCredits");

export const apiInitError = getApiError("init");
export const apiCensorCommentError = getApiError("censorComment");
export const apiNewUserError = or(apiInitError, getApiError("newUser"));
export const apiUserError = getApiError("user");
export const apiChangePasswordError = or(
  apiInitError,
  getApiError("changePassword")
);
export const apiChangeUsernameError = or(
  apiInitError,
  getApiError("changeUsername")
);
export const apiVerifyNewUserError = or(
  apiInitError,
  getApiError("verifyNewUser")
);
export const apiForgottenPasswordError = or(
  apiInitError,
  getApiError("forgottenPassword")
);
export const apiPasswordResetError = or(
  apiInitError,
  getApiError("passwordReset")
);
export const apiLoginError = or(apiInitError, getApiError("login"));
export const apiLogoutError = getApiError("logout");
export const apiUserSearchError = getApiError("userSearch");
const apiVettedError = getApiError("vetted");
const apiUserProposalsError = getApiError("userProposals");
export const apiUnvettedError = getApiError("unvetted");
const apiProposalError = getApiError("proposal");
const apiNewProposalError = getApiError("newProposal");
const apiNewInvoiceError = getApiError("newInvoice");
const apiUserInvoicesError = getApiError("userInvoices");
const apiSetStatusProposalError = getApiError("setStatusProposal");
const apiCommentsLikesError = getApiError("commentslikes");
export const apiError = or(
  apiInitError,
  apiNewUserError,
  apiChangePasswordError,
  apiChangeUsernameError,
  apiVerifyNewUserError,
  apiCensorCommentError,
  apiLoginError,
  apiLogoutError,
  apiVettedError,
  apiUserProposalsError,
  apiProposalError,
  apiUserSearchError,
  apiNewProposalError,
  apiCommentsLikesError,
  apiSetStatusProposalError
);

export const csrf = compose(
  get("csrfToken"),
  apiInitResponse
);

export const newUserEmail = compose(
  get("email"),
  apiNewUserPayload
);
export const forgottenPassEmail = compose(
  get("email"),
  apiForgottenPasswordPayload
);
export const emailForResendVerification = compose(
  get("email"),
  apiResendVerificationEmailPayload
);

export const email = or(
  compose(
    get("email"),
    apiMeResponse
  ),
  compose(
    get("email"),
    apiLoginPayload
  )
);

export const loggedInAsEmail = or(
  compose(
    get("email"),
    apiMeResponse
  )
);

export const lastLoginTime = or(
  compose(
    get("lastlogintime"),
    apiMeResponse
  )
);

export const getUserUsername = or(
  compose(
    get("username"),
    apiChangeUsernameResponse
  ),
  compose(
    get("username"),
    apiUserResponse
  )
);

export const loggedInAsUsername = or(
  compose(
    get("username"),
    apiChangeUsernameResponse
  ),
  compose(
    get("username"),
    apiMeResponse
  )
);

export const isAdmin = bool(
  or(
    compose(
      get("isadmin"),
      apiMeResponse
    ),
    compose(
      get("isadmin"),
      apiLoginResponse
    )
  )
);

export const userAlreadyPaid = bool(state => {
  if (state.api.me && state.api.me.response) {
    return state.api.me.response.paywalladdress === "";
  }
  if (state.api.login && state.api.login.response) {
    return state.api.login.response.paywalladdress === "";
  }

  return false;
});

export const paywallAddress = compose(
  get("paywalladdress"),
  apiMeResponse
);
export const paywallTxid = compose(
  get("paywalltxid"),
  apiMeResponse
);

export const paywallAmount = state => {
  let paywallAmount = 0;
  if (state.api.me && state.api.me.response) {
    paywallAmount = state.api.me.response.paywallamount;
  }

  // Amount returned from the server is in atoms, so convert to dcr.
  return paywallAmount / 100000000;
};

export const paywallTxNotBefore = state => {
  if (state.api.me && state.api.me.response) {
    return state.api.me.response.paywalltxnotbefore;
  }

  return null;
};

export const isTestNet = compose(
  get("testnet"),
  apiInitResponse
);
export const isMainNet = not(isTestNet);

export const getPropVoteStatus = createDeepEqualSelector(
  apiPropsVoteStatusResponse,
  vsResponse => {
    const getVoteStatusByToken = token =>
      (vsResponse && vsResponse[token]) || {};
    return getVoteStatusByToken;
  }
);

export const makeGetPropVoteStatus = token => {
  return createSelector(
    apiPropsVoteStatusResponse,
    vsResponse => (vsResponse ? vsResponse[token] : null)
  );
};

export const apiPropsVoteSummaryError = getApiError(
  "proposalsVoteSummaryError"
);

const apiPropsVoteSummaries = getApiResponse("proposalsVoteSummary");
export const makeGetPropVoteSummary = token => {
  return createSelector(
    apiPropsVoteSummaries,
    vsResponse => (vsResponse ? vsResponse[token] : null)
  );
};

export const getBestBlockFromVoteSummaryResponse = createSelector(
  apiPropsVoteSummaries,
  vsResponse => vsResponse && vsResponse.bestblock
);

export const proposalWithVoteStatus = state => {
  const proposal = apiProposal(state);
  const voteStatus = proposal
    ? getPropVoteStatus(state)(proposal.censorshiprecord.token)
    : {};
  return (
    !!proposal && {
      ...proposal,
      voteStatus
    }
  );
};

export const userid = state =>
  (state.api.me.response && state.api.me.response.userid) ||
  (state.api.login.response && state.api.login.response.userid);

export const censoredComment = state => state.api.censorComment.response;

export const getApiLastLoaded = key => get(["api", "lastLoaded", key]);

export const lastLoadedUnvettedProposal = getApiLastLoaded("unvetted");
export const lastLoadedVettedProposal = getApiLastLoaded("vetted");
export const lastLoadedUserProposal = getApiLastLoaded("userProposals");
export const lastLoadedUserDetailProposal = getApiLastLoaded("user");

export const serverPubkey = compose(
  get("pubkey"),
  apiInitResponse
);
export const userPubkey = compose(
  get("publickey"),
  apiMeResponse
);
export const commentsLikes = or(
  compose(
    get("commentslikes"),
    apiCommentsLikesResponse
  ),
  constant(null)
);
export const policy = apiPolicyResponse;
export const isLoadingSubmit = or(
  isApiRequestingPolicy,
  isApiRequestingInit,
  isApiRequestingEditProposal
);
export const apiVettedProposals = or(
  compose(
    get("proposals"),
    apiVettedResponse
  ),
  constant([])
);

export const proposalsWithVoteSummary = createDeepEqualSelector(
  apiVettedProposals,
  proposals =>
    proposals.map(prop => ({
      ...prop,
      voteSummary: {}
    }))
);

export const vettedProposalsIsRequesting = isApiRequestingVetted;
export const vettedProposalsError = or(apiInitError, apiVettedError);

export const apiUserProposals = or(
  compose(
    get("proposals"),
    apiUserProposalsResponse
  ),
  constant([])
);

export const numOfUserProposals = compose(
  get("numofproposals"),
  apiUserProposalsResponse
);

export const userProposalsIsRequesting = isApiRequestingUserProposals;
export const userProposalsError = or(apiInitError, apiUserProposalsError);
export const apiUnvettedProposals = or(
  compose(
    get("proposals"),
    apiUnvettedResponse
  ),
  constant([])
);
const filtered = status =>
  compose(
    filter(
      compose(
        eq(status),
        get("status")
      )
    ),
    apiUnvettedProposals
  );
export const unreviewedProposals = filtered(PROPOSAL_STATUS_UNREVIEWED);
export const abandonedProposals = filtered(PROPOSAL_STATUS_ABANDONED);
export const censoredProposals = filtered(PROPOSAL_STATUS_CENSORED);
export const unvettedProposalsIsRequesting = or(
  isApiRequestingInit,
  isApiRequestingUnvetted
);
export const unvettedProposalsError = or(apiInitError, apiUnvettedError);
export const apiProposal = compose(
  get("proposal"),
  apiProposalResponse
);
export const apiInvoice = compose(
  get("invoice"),
  apiInvoiceResponse
);
export const proposalPayload = state => state.api.proposal.payload;
export const proposalToken = compose(
  get(["censorshiprecord", "token"]),
  apiProposal
);
export const proposalStatus = compose(
  get("status"),
  apiProposal
);

export const proposalAuthor = compose(
  get(["username"]),
  apiProposal
);

export const proposalName = compose(
  get(["name"]),
  apiProposal
);

export const apiProposalComments = or(
  compose(
    get("comments"),
    apiProposalCommentsResponse
  ),
  constant([])
);

export const apiProposalsBatchError = getApiError("proposalsBatch");

export const apiInvoiceComments = or(
  compose(
    get("comments"),
    apiInvoiceCommentsResponse
  ),
  constant([])
);
export const proposalIsRequesting = or(
  isApiRequestingInit,
  isApiRequestingProposal
);
export const invoiceIsRequesting = isApiRequestingInvoice;
export const proposalError = or(apiInitError, apiProposalError);
export const user = compose(
  get("user"),
  apiUserResponse
);
export const newUserResponse = bool(apiNewUserResponse);
export const newProposalIsRequesting = isApiRequestingNewProposal;
export const newInvoiceIsRequesting = isApiRequestingNewInvoice;
export const newProposalError = apiNewProposalError;
export const newInvoiceError = apiNewInvoiceError;
export const userInvoiceError = apiUserInvoicesError;
export const newProposalMerkle = compose(
  get(["censorshiprecord", "merkle"]),
  apiNewProposalResponse
);
export const newProposalToken = compose(
  get(["censorshiprecord", "token"]),
  apiNewProposalResponse
);
export const newProposalSignature = compose(
  get(["censorshiprecord", "signature"]),
  apiNewProposalResponse
);
export const newProposalName = compose(
  get("name"),
  apiNewProposalPayload
);
export const newProposalDescription = compose(
  get("description"),
  apiNewProposalPayload
);
export const newProposalFiles = compose(
  get("files"),
  apiNewProposalPayload
);
export const newInvoiceMerkle = compose(
  get(["censorshiprecord", "merkle"]),
  apiNewInvoiceResponse
);
export const newInvoiceToken = compose(
  get(["censorshiprecord", "token"]),
  apiNewInvoiceResponse
);
export const newInvoiceSignature = compose(
  get(["censorshiprecord", "signature"]),
  apiNewInvoiceResponse
);
export const newInvoiceYear = compose(
  get("year"),
  apiNewInvoicePayload
);
export const newInvoiceMonth = compose(
  get("month"),
  apiNewInvoicePayload
);
export const newInvoiceFiles = compose(
  get("files"),
  apiNewInvoicePayload
);
export const apiUserInvoices = compose(
  get("invoices"),
  apiUserInvoicesResponse
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
export const setStatusProposalError = apiSetStatusProposalError;
export const verificationToken = compose(
  get("verificationtoken"),
  apiNewUserResponse
);
export const getKeyMismatch = state => state.api.keyMismatch;
export const manageUserAction = compose(
  get("action"),
  apiManageUserPayload
);
export const lastLoginTimeFromLoginResponse = compose(
  get("lastlogintime"),
  apiLoginResponse
);
export const lastLoginTimeFromMeResponse = compose(
  get("lastlogintime"),
  apiMeResponse
);
export const sessionMaxAge = compose(
  get("sessionmaxage"),
  apiMeResponse
);

export const visitedProposal = compose(
  get("accesstime"),
  getApiResponse("proposalComments")
);

export const apiEditProposalResponse = getApiResponse("editProposal");
export const apiEditProposalError = getApiError("editProposal");
export const apiEditProposalPayload = getApiPayload("editProposal");
export const editProposalToken = compose(
  get(["proposal", "censorshiprecord", "token"]),
  apiEditProposalResponse
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

export const amountOfCreditsAddedOnRescan = state => {
  const newCredits = apiRescanUserPaymentsNewCredits(state);
  return newCredits && newCredits.length;
};

export const apiTokenInventoryResponse = getApiResponse("tokenInventory");
export const apiTokenInventoryError = getApiError("tokenInventory");
export const apiTokenInventoryPayload = getApiPayload("tokenInventory");
export const apiTokenInventoryIsRequesting = getIsApiRequesting(
  "tokenInventory"
);

export const isApiRequesting = or(
  isApiRequestingInit,
  isApiRequestingUnvettedStatus,
  isApiRequestingPolicy,
  isApiRequestingNewUser,
  isApiRequestingVerifyNewUser,
  isApiRequestingLogin,
  isApiRequestingLogout,
  isApiRequestingForgottenPassword,
  isApiRequestingResendVerificationEmail,
  isApiRequestingPasswordReset,
  isApiRequestingVetted,
  isApiRequestingUnvetted,
  isApiRequestingUserProposals,
  isApiRequestingProposal,
  isApiRequestingNewProposal,
  isApiRequestingUser,
  isApiRequestingNewComment,
  isApiRequestingSetStatusProposal,
  isApiRequestingStartVote,
  isApiRequestingPropsVoteStatus,
  isApiRequestingPropVoteStatus,
  isApiRequestingPropVoteResults
);

export const resetPasswordResponse = getApiResponse("resetPassword");

export const isApiRequestingComments = or(
  getIsApiRequesting("proposalComments"),
  getIsApiRequesting("invoiceComments")
);

export const isApiRequestingCommentsLikes = getIsApiRequesting("commentslikes");

// CMS Selectors
const mode = compose(
  get("mode"),
  apiInitResponse
);

export const isModeFetched = state => {
  if (mode(state) === undefined) {
    return false;
  } else {
    return true;
  }
};

export const isCMS = state => mode(state) === CMSWWWMODE;

export const invoiceToken = compose(
  get(["censorshiprecord", "token"]),
  apiInvoice
);

export const inviteUserResponse = getApiResponse("inviteUser");
export const isApiRequestingInviteUser = getIsApiRequesting("inviteUser");

export const isApiRequestingPayInvoices = getIsApiRequesting("payApproved");

export const isApiRequestingAdminInvoices = getIsApiRequesting("adminInvoices");
export const adminInvoicesResponse = getApiResponse("adminInvoices");
export const apiAdminInvoices = compose(
  get("invoices"),
  adminInvoicesResponse
);
export const resetPassEmail = compose(
  get("email"),
  getApiPayload("resetPassword")
);
export const adminInvoicesError = getApiError("adminInvoices");

export const isApiRequestingUserInvoices = getIsApiRequesting("userInvoices");

export const isApiRequestingSetStatusInvoice = getIsApiRequesting(
  "setStatusInvoice"
);
export const setStatusInvoicePayload = getApiPayload("setStatusInvoice");
export const setStatusInvoicePayloadToken = compose(
  get("token"),
  setStatusInvoicePayload
);
export const setStatusInvoicePayloadStatus = compose(
  get("status"),
  setStatusInvoicePayload
);

export const invoicePayoutsResponse = getApiResponse("invoicePayouts");
export const invoicePayoutsError = getApiError("invoicePayouts");
export const isApiRequestingInvoicePayouts = getIsApiRequesting(
  "invoicePayouts"
);
export const invoicePayouts = compose(
  get("invoices"),
  invoicePayoutsResponse
);

export const lineItemPayouts = state => {
  const invoices = invoicePayouts(state);
  const lineItems = [];
  if (invoices) {
    invoices.forEach(invoice => {
      console.log(invoice);
      const contractorrate = invoice.input.contractorrate / 100;
      invoice.input.lineitems.forEach(lineItem => {
        lineItem.timestamp = invoice.timestamp;
        lineItem.token = invoice.censorshiprecord.token;
        lineItem.labor = (lineItem.labor / 60) * contractorrate;
        lineItems.push(lineItem);
      });
    });
  }
  console.log(lineItems);
  lineItems.sort((a, b) => a.timestamp - b.timestamp);
  console.log(lineItems);
  return lineItems;
};

export const generatePayoutsResponse = getApiResponse("payouts");
export const generatePayoutsError = getApiError("payouts");
export const isApiRequestingGeneratePayouts = getIsApiRequesting("payouts");
export const payouts = compose(
  get("payouts"),
  generatePayoutsResponse
);

export const isApiRequestingSetInvoiceStatusByToken = state => token => {
  return (
    isApiRequestingSetStatusInvoice(state) &&
    setStatusInvoicePayloadToken(state) === token &&
    setStatusInvoicePayloadStatus(state)
  );
};

export const usePaywall = and(not(isCMS));

export const apiEditInvoiceResponse = getApiResponse("editInvoice");
export const apiEditInvoiceError = getApiError("editInvoice");

export const editInvoiceToken = compose(
  get(["invoice", "censorshiprecord", "token"]),
  apiEditInvoiceResponse
);

export const visitedInvoice = compose(
  get("accesstime"),
  getApiResponse("invoiceComments")
);

export const apiExchangeRateResponse = getApiResponse("exchangeRate");
export const apiExchangeRateError = getApiError("exchangeRate");
export const isApiRequestingExchangeRate = getIsApiRequesting("exchangeRate");
export const exchangeRate = compose(
  get("exchangerate"),
  apiExchangeRateResponse
);
