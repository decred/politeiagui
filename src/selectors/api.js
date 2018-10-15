import get from "lodash/fp/get";
import eq from "lodash/fp/eq";
import filter from "lodash/fp/filter";
import compose from "lodash/fp/compose";
import { or, bool, constant, not } from "../lib/fp";
import { PROPOSAL_STATUS_UNREVIEWED, PROPOSAL_STATUS_CENSORED } from "../constants";


export const getIsApiRequesting = key => bool(get([ "api", key, "isRequesting" ]));
export const getApiPayload = key => get([ "api", key, "payload" ]);
export const getApiResponse = key => get([ "api", key, "response" ]);
export const getApiError = key => get([ "api", key, "error" ]);

export const isApiRequestingInit = getIsApiRequesting("init");
export const isApiRequestingUnvettedStatus = getIsApiRequesting("unvettedStatus");
export const isApiRequestingMe = getIsApiRequesting("me");
const isApiRequestingPolicy = getIsApiRequesting("policy");
export const isApiRequestingNewUser = getIsApiRequesting("newUser");
export const isApiRequestingChangePassword = getIsApiRequesting("changePassword");
export const isApiRequestingChangeUsername = getIsApiRequesting("changeUsername");
export const isApiRequestingVerifyNewUser = getIsApiRequesting("verifyNewUser");
export const isApiRequestingLogin = getIsApiRequesting("login");
export const isApiRequestingLogout = getIsApiRequesting("logout");
export const isApiRequestingForgottenPassword = getIsApiRequesting("forgottenPassword");
export const isApiRequestingResendVerificationEmail = getIsApiRequesting("resendVerificationEmail");
export const isApiRequestingPasswordReset = getIsApiRequesting("passwordReset");
const isApiRequestingVetted = getIsApiRequesting("vetted");
const isApiRequestingUnvetted = getIsApiRequesting("unvetted");
const isApiRequestingUserProposals = getIsApiRequesting("userProposals");
const isApiRequestingProposal = getIsApiRequesting("proposal");
const isApiRequestingNewProposal = getIsApiRequesting("newProposal");
export const isApiRequestingUser = getIsApiRequesting("user");
export const isApiRequestingNewComment = getIsApiRequesting("newComment");
export const isApiRequestingSetStatusProposal = getIsApiRequesting("setStatusProposal");
export const isApiRequestingPropsVoteStatus = getIsApiRequesting("proposalsVoteStatus");
export const isApiRequestingPropVoteStatus = getIsApiRequesting("proposalVoteStatus");
export const isApiRequestingEditUser = getIsApiRequesting("editUser");

const apiNewUserPayload = getApiPayload("newUser");
const apiLoginPayload = getApiPayload("login");
const apiForgottenPasswordPayload = getApiPayload("forgottenPassword");
const apiResendVerificationEmailPayload = getApiPayload("resendVerificationEmail");
const apiNewProposalPayload = getApiPayload("newProposal");
const apiSetStatusProposalPayload = getApiPayload("setStatusProposal");
const apiEditUserPayload = getApiPayload("editUser");

export const apiMeResponse = getApiResponse("me");
export const apiUnvettedStatusResponse = getApiResponse("unvettedStatus");
const apiInitResponse = getApiResponse("init");
const apiPolicyResponse = getApiResponse("policy");
const apiNewUserResponse = getApiResponse("newUser");
const apiUserResponse = getApiResponse("user");
export const apiChangePasswordResponse = getApiResponse("changePassword");
export const apiChangeUsernameResponse = getApiResponse("changeUsername");
export const apiLoginResponse = getApiResponse("login");
export const forgottenPasswordResponse = getApiResponse("forgottenPassword");
export const resendVerificationEmailResponse = getApiResponse("resendVerificationEmail");
export const passwordResetResponse = getApiResponse("passwordReset");
const apiVettedResponse = getApiResponse("vetted");
const apiUserProposalsResponse = getApiResponse("userProposals");
const apiUnvettedResponse = getApiResponse("unvetted");
const apiProposalResponse = getApiResponse("proposal");
const apiProposalCommentsResponse = getApiResponse("proposalComments");
const apiNewProposalResponse = getApiResponse("newProposal");
const apiSetStatusProposalResponse = getApiResponse("setStatusProposal");
export const verifyNewUser = getApiResponse("verifyNewUser");
export const updateUserKey = getApiResponse("updateUserKey");
export const verifyUserKey = getApiResponse("verifyUserKey");
export const updateUserKeyError = getApiError("updateUserKey");
export const verifyUserKeyError = getApiError("verifyUserKey");
const apiCommentsVotesResponse = getApiResponse("commentsvotes");
export const editUserResponse = getApiResponse("editUser");

export const apiLikeCommentResponse = getApiResponse("likeComment");
export const apiLikeCommentError = getApiError("likeComment");
export const apiLikeCommentPayload = getApiPayload("likeComment");

export const apiPropsVoteStatusResponse = getApiResponse("proposalsVoteStatus");
export const apiPropsVoteStatusError = getApiError("proposalsVoteStatus");

export const apiPropVoteStatusResponse = getApiResponse("proposalVoteStatus");
export const apiPropVoteStatusError = getApiError("proposalVoteStatusError");

export const apiAuthorizeVoteResponse = getApiResponse("authorizeVote");
export const apiAuthorizeVotePayload = getApiPayload("authorizeVote");
export const apiAuthorizeVoteError = getApiError("authorizeVote");
export const isApiRequestingAuthorizeVote = getIsApiRequesting("authorizeVote");
export const apiAuthorizeVoteToken = compose(get("token"), apiAuthorizeVotePayload);

export const apiStartVoteResponse = getApiResponse("startVote");
export const apiStartVotePayload = getApiPayload("startVote");
export const apiStartVoteError = getApiError("startVote");
export const isApiRequestingStartVote = getIsApiRequesting("startVote");
export const apiStartVoteToken = compose(get("token"), apiStartVotePayload);

export const isApiRequestingSetProposalStatusByToken = state => token => {
  return setStatusProposalIsRequesting(state) && setStatusProposalToken(state) === token && setStatusProposalStatus(state);
};

const apiProposalPaywallDetailsResponse = getApiResponse("proposalPaywallDetails");
export const proposalPaywallAddress = compose(get("paywalladdress"), apiProposalPaywallDetailsResponse);
export const proposalCreditPrice = state => {
  let creditPrice = 0;
  if(state.api.proposalPaywallDetails && state.api.proposalPaywallDetails.response) {
    creditPrice = state.api.proposalPaywallDetails.response.creditprice;
  }

  // Amount returned from the server is in atoms, so convert to dcr.
  return creditPrice / 100000000;
};
export const proposalPaywallTxNotBefore = compose(get("paywalltxnotbefore"), apiProposalPaywallDetailsResponse);
export const isApiRequestingProposalPaywall = getIsApiRequesting("proposalPaywallDetails");
export const proposalPaywallError = getApiError("proposalPaywallDetails");

export const isApiRequestingUpdateProposalCredits = getIsApiRequesting("updateProposalCredits");
export const updateProposalCreditsError = getApiError("updateProposalCredits");
const apiUserProposalCreditsResponse = getApiResponse("userProposalCredits");
export const proposalCreditPurchases = state => {
  const r = apiUserProposalCreditsResponse(state);
  if(!r || !r.spentcredits || !r.unspentcredits) {
    return [];
  }

  const purchasesMap = {};
  [ ...r.spentcredits, ...r.unspentcredits ].forEach(credit => {
    if(credit.paywallid in purchasesMap) {
      purchasesMap[credit.paywallid].numberPurchased++;
    } else {
      purchasesMap[credit.paywallid] = {
        price: credit.price / 100000000,
        datePurchased: credit.datepurchased,
        numberPurchased: 1,
        txId: credit.txid
      };
    }
  });

  return Object.values(purchasesMap).sort((a, b) => a.datePurchased - b.datePurchased);
};
export const isApiRequestingUserProposalCredits = getIsApiRequesting("userProposalCredits");
export const userProposalCreditsError = getApiError("userProposalCredits");

export const apiInitError = getApiError("init");
export const apiCensorCommentError = getApiError("censorComment");
export const apiNewUserError = or(apiInitError, getApiError("newUser"));
export const apiUserError = getApiError("user");
export const apiChangePasswordError = or(apiInitError, getApiError("changePassword"));
export const apiChangeUsernameError = or(apiInitError, getApiError("changeUsername"));
export const apiVerifyNewUserError = or(apiInitError, getApiError("verifyNewUser"));
export const apiForgottenPasswordError = or(apiInitError, getApiError("forgottenPassword"));
export const apiPasswordResetError = or(apiInitError, getApiError("passwordReset"));
export const apiLoginError = or(apiInitError, getApiError("login"));
export const apiLogoutError = or(apiInitError, getApiError("logout"));
const apiVettedError = getApiError("vetted");
const apiUserProposalsError = getApiError("userProposals");
const apiUnvettedError = getApiError("unvetted");
const apiProposalError = getApiError("proposal");
const apiNewProposalError = getApiError("newProposal");
const apiSetStatusProposalError = getApiError("setStatusProposal");
const apiCommentsVotesError = getApiError("commentsvotes");
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
  apiNewProposalError,
  apiCommentsVotesError,
  apiSetStatusProposalError
);

export const csrf = compose(get("csrfToken"), apiInitResponse);

export const newUserEmail = compose(get("email"), apiNewUserPayload);
export const forgottenPassEmail = compose(get("email"), apiForgottenPasswordPayload);
export const emailForResendVerification = compose(get("email"), apiResendVerificationEmailPayload);

export const email = or(
  compose(get("email"), apiMeResponse),
  compose(get("email"), apiLoginPayload)
);

export const loggedInAsEmail = or(
  compose(get("email"), apiMeResponse)
);
export const loggedInAsUsername = or(
  compose(get("username"), apiChangeUsernameResponse),
  compose(get("username"), apiMeResponse)
);

export const isAdmin = bool(or(
  compose(get("isadmin"), apiMeResponse),
  compose(get("isadmin"), apiLoginResponse)
));

export const userAlreadyPaid = bool(state => {
  if(state.api.me && state.api.me.response) {
    return state.api.me.response.paywalladdress === "";
  }
  if(state.api.login && state.api.login.response) {
    return state.api.login.response.paywalladdress === "";
  }

  return false;
});

export const paywallAddress = compose(get("paywalladdress"), apiMeResponse);

export const paywallAmount = state => {
  let paywallAmount = 0;
  if(state.api.me && state.api.me.response) {
    paywallAmount = state.api.me.response.paywallamount;
  }

  // Amount returned from the server is in atoms, so convert to dcr.
  return paywallAmount / 100000000;
};

export const paywallTxNotBefore = state => {
  if(state.api.me && state.api.me.response) {
    return state.api.me.response.paywalltxnotbefore;
  }

  return null;
};

export const isTestNet = compose(get("testnet"), apiInitResponse);
export const isMainNet = not(isTestNet);

export const getPropVoteStatus = state => token => {
  // try to get it from single prop response (proposal detail)
  let vsResponse = apiPropVoteStatusResponse(state);
  if(vsResponse && vsResponse.token === token)
    return vsResponse;
  // otherwise try to get it from the all vote status response (public props)
  vsResponse = apiPropsVoteStatusResponse(state);
  if (vsResponse && vsResponse.votesstatus) {
    const voteStatus = vsResponse.votesstatus.filter(vs => vs.token === token)[0];
    return voteStatus || {};
  }
  return {};
};

export const userid = state => state.api.me.response && state.api.me.response.userid;
export const censoredComment = state => state.api.censorComment.response;

// const lastLoaded = (func, state) => func(state) ? func(state).lastloaded : {};
// export const lastLoadedUnvettedProposal = state => lastLoaded(apiUnvettedResponse, state);
// export const lastLoadedVettedProposal = state => lastLoaded(apiVettedResponse, state);
// export const lastLoadedUserProposal = state => lastLoaded(apiUserProposalsResponse, state);

export const getApiLastLoaded = key => get([ "api", "lastLoaded", key ]);

export const lastLoadedUnvettedProposal = getApiLastLoaded("unvetted");
export const lastLoadedVettedProposal = getApiLastLoaded("vetted");
export const lastLoadedUserProposal = getApiLastLoaded("userProposals");
export const lastLoadedUserDetailProposal = getApiLastLoaded("user");

// export const lastLoadedUserDetailProposal = state => {
//   const vp = user(state) ? user(state).proposals : [];
//   const last = Object.keys(vp).length - 1;
//   return last > -1 ? vp[last] : {};
// };

export const serverPubkey = compose(get("pubkey"), apiInitResponse);
export const userPubkey = compose(get("publickey"), apiMeResponse);
export const commentsVotes = or(compose(get("commentsvotes"), apiCommentsVotesResponse), constant(null));
export const policy = apiPolicyResponse;
export const isLoadingSubmit = or(isApiRequestingPolicy, isApiRequestingInit);
export const apiVettedProposals = or(compose(get("proposals"), apiVettedResponse), constant([]));
export const vettedProposalsIsRequesting = isApiRequestingVetted;
export const vettedProposalsError = or(apiInitError, apiVettedError);
export const numOfUserProposals = or(compose(get("numofproposals"), apiUserProposalsResponse), constant(0));
export const apiUserProposals = or(compose(get("proposals"), apiUserProposalsResponse), constant([]));
export const userProposalsIsRequesting = isApiRequestingUserProposals;
export const userProposalsError = or(apiInitError, apiUserProposalsError);
export const apiUnvettedProposals = or(compose(get("proposals"), apiUnvettedResponse), constant([]));
const filtered = status => compose(filter(compose(eq(status), get("status"))), apiUnvettedProposals);
export const unreviewedProposals = filtered(PROPOSAL_STATUS_UNREVIEWED);
export const censoredProposals = filtered(PROPOSAL_STATUS_CENSORED);
export const unvettedProposalsIsRequesting = or(isApiRequestingInit, isApiRequestingUnvetted);
export const unvettedProposalsError = or(apiInitError, apiUnvettedError);
export const apiProposal = compose(get("proposal"), apiProposalResponse);
export const proposalPayload = (state) => state.api.proposal.payload;
export const proposalToken = compose(get([ "censorshiprecord", "token" ]), apiProposal);
export const apiProposalComments = or(compose(get("comments"), apiProposalCommentsResponse), constant([]));
export const proposalIsRequesting = or(isApiRequestingInit, isApiRequestingProposal);
export const proposalError = or(apiInitError, apiProposalError);
export const user = compose(get("user"), apiUserResponse);
export const newUserResponse = bool(apiNewUserResponse);
export const newProposalIsRequesting = isApiRequestingNewProposal;
export const newProposalError = apiNewProposalError;
export const newProposalMerkle = compose(get([ "censorshiprecord", "merkle" ]), apiNewProposalResponse);
export const newProposalToken = compose(get([ "censorshiprecord", "token" ]), apiNewProposalResponse);
export const newProposalSignature = compose(get([ "censorshiprecord", "signature" ]), apiNewProposalResponse);
export const newProposalName = compose(get("name"), apiNewProposalPayload);
export const newProposalDescription = compose(get("description"), apiNewProposalPayload);
export const newProposalFiles = compose(get("files"), apiNewProposalPayload);
export const setStatusProposal = compose(get("status"), apiSetStatusProposalResponse);
export const setStatusProposalIsRequesting = isApiRequestingSetStatusProposal;
export const setStatusProposalToken = compose(get("token"), apiSetStatusProposalPayload);
export const setStatusProposalStatus = compose(get("status"), apiSetStatusProposalPayload);
export const setStatusProposalError = apiSetStatusProposalError;
export const redirectedFrom = get([ "api", "login", "redirectedFrom" ]);
export const verificationToken = compose(get("verificationtoken"), apiNewUserResponse);
export const getKeyMismatch = state => state.api.keyMismatch;
export const editUserAction = compose(get("action"), apiEditUserPayload);
export const lastLoginTimeFromLoginResponse = compose(get("lastlogintime"), apiLoginResponse);
export const lastLoginTimeFromMeResponse = compose(get("lastlogintime"), apiMeResponse);
export const sessionMaxAge = compose(get("sessionmaxage"), apiMeResponse);


export const apiEditProposalResponse = getApiResponse("editProposal");
export const apiEditProposalError = getApiError("editProposal");
export const apiEditProposalPayload = getApiPayload("editProposal");
export const editProposalToken = compose(get([ "proposal", "censorshiprecord", "token" ]), apiEditProposalResponse);

export const apiProposalPaywallPaymentResponse = getApiResponse("proposalPaywallPayment");
export const apiProposalPaywallPaymentError = getApiError("proposalPaywallPayment");
export const apiProposalPaywallPaymentTxid = compose(get("txid"), apiProposalPaywallPaymentResponse);
export const apiProposalPaywallPaymentAmount = compose(get("amount"), apiProposalPaywallPaymentResponse);
export const apiProposalPaywallPaymentConfirmations = compose(get("confirmations"), apiProposalPaywallPaymentResponse);


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
  isApiRequestingEditUser,
);
