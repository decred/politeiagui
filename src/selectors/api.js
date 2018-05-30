import get from "lodash/fp/get";
import eq from "lodash/fp/eq";
import filter from "lodash/fp/filter";
import compose from "lodash/fp/compose";
import { or, bool, constant, not } from "../lib/fp";
import { PROPOSAL_STATUS_UNREVIEWED, PROPOSAL_STATUS_CENSORED } from "../constants";

const getIsApiRequesting = key => bool(get(["api", key, "isRequesting"]));
const getApiPayload = key => get(["api", key, "payload"]);
const getApiResponse = key => get(["api", key, "response"]);
const getApiError = key => get(["api", key, "error"]);

export const isApiRequestingInit = getIsApiRequesting("init");
const isApiRequestingPolicy = getIsApiRequesting("policy");
export const isApiRequestingNewUser = getIsApiRequesting("newUser");
export const isApiRequestingChangePassword = getIsApiRequesting("changePassword");
export const isApiRequestingChangeUsername = getIsApiRequesting("changeUsername");
export const isApiRequestingVerifyNewUser = getIsApiRequesting("verifyNewUser");
export const isApiRequestingLogin = getIsApiRequesting("login");
export const isApiRequestingLogout = getIsApiRequesting("logout");
export const isApiRequestingForgottenPassword = getIsApiRequesting("forgottenPassword");
export const isApiRequestingPasswordReset = getIsApiRequesting("passwordReset");
const isApiRequestingVetted = getIsApiRequesting("vetted");
const isApiRequestingUserProposals = getIsApiRequesting("userProposals");
const isApiRequestingUnvetted = getIsApiRequesting("unvetted");
const isApiRequestingProposal = getIsApiRequesting("proposal");
const isApiRequestingNewProposal = getIsApiRequesting("newProposal");
export const isApiRequestingActiveVotes = getIsApiRequesting("activeVotes");
export const isApiRequestingVoteResults = getIsApiRequesting("voteResults");
export const isApiRequestingNewComment = getIsApiRequesting("newComment");
export const isApiRequestingSetStatusProposal = getIsApiRequesting("setStatusProposal");
export const isApiRequestingStartVote = getIsApiRequesting("startVote");
export const isApiRequesting = or(
  isApiRequestingInit,
  isApiRequestingPolicy,
  isApiRequestingNewUser,
  isApiRequestingVerifyNewUser,
  isApiRequestingLogin,
  isApiRequestingLogout,
  isApiRequestingVetted,
  isApiRequestingUserProposals,
  isApiRequestingProposal,
  isApiRequestingNewProposal,
  isApiRequestingNewComment,
  isApiRequestingSetStatusProposal,
  isApiRequestingStartVote,
);

const apiNewUserPayload = getApiPayload("newUser");
const apiLoginPayload = getApiPayload("login");
const apiForgottenPasswordPayload = getApiPayload("forgottenPassword");
const apiNewProposalPayload = getApiPayload("newProposal");
const apiSetStatusProposalPayload = getApiPayload("setStatusProposal");

export const apiMeResponse = getApiResponse("me");
const apiInitResponse = getApiResponse("init");
const apiPolicyResponse = getApiResponse("policy");
const apiNewUserResponse = getApiResponse("newUser");
export const apiChangePasswordResponse = getApiResponse("changePassword");
export const apiChangeUsernameResponse = getApiResponse("changeUsername");
const apiLoginResponse = getApiResponse("login");
export const forgottenPasswordResponse = getApiResponse("forgottenPassword");
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
const apiActiveVotesResponse = getApiResponse("activeVotes");
const apiActiveVotesError = getApiError("activeVotes");
const apiSetStartVoteResponse = getApiResponse("startVote");
const apiVoteResultsResponse = getApiResponse("voteResults");
const apiVoteResultsError = getApiError("voteResults");

const apiInitError = getApiError("init");
export const apiNewUserError = or(apiInitError, getApiError("newUser"));
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
export const apiError = or(
  apiInitError,
  apiNewUserError,
  apiChangePasswordError,
  apiChangeUsernameError,
  apiVerifyNewUserError,
  apiLoginError,
  apiLogoutError,
  apiVettedError,
  apiUserProposalsError,
  apiProposalError,
  apiNewProposalError,
  apiSetStatusProposalError
);

export const csrf = or(
  compose(get("csrfToken"), apiMeResponse),
  compose(get("csrfToken"), apiInitResponse)
);
export const email = or(
  compose(get("email"), apiMeResponse),
  compose(get("email"), apiLoginPayload),
  compose(get("email"), apiNewUserPayload),
  compose(get("email"), apiForgottenPasswordPayload)
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

export const paywallAddress = or(
  compose(get("paywalladdress"), apiNewUserResponse),
  compose(get("paywalladdress"), apiMeResponse),
);

export const paywallAmount = state => {
  let paywallAmount = 0;
  if(state.api.newUser && state.api.newUser.response) {
    paywallAmount = state.api.newUser.response.paywallamount;
  }
  else if(state.api.me && state.api.me.response) {
    paywallAmount = state.api.me.response.paywallamount;
  }

  // Amount returned from the server is in atoms, so convert to dcr.
  return paywallAmount / 100000000;
};

export const paywallTxNotBefore = state => {
  if(state.api.newUser && state.api.newUser.response) {
    return state.api.newUser.response.paywalltxnotbefore;
  }
  if(state.api.me && state.api.me.response) {
    return state.api.me.response.paywalltxnotbefore;
  }

  return null;
};

export const isTestNet = bool(compose(get("testnet"), apiInitResponse));
export const isMainNet = not(isTestNet);

export const getPropTokenIfIsStartingVote = (state) => {
  if(state.api.startVote && state.api.startVote.isRequesting) {
    return state.api.startVote.payload && state.api.startVote.payload.token;
  }
  return undefined;
};

export const userid = state => state.api.me.response && state.api.me.response.userid;

export const serverPubkey = state => state.api.me.response && state.api.me.response.pubkey;
export const policy = apiPolicyResponse;
export const isLoadingSubmit = or(isApiRequestingPolicy, isApiRequestingInit);
export const vettedProposals = or(compose(get("proposals"), apiVettedResponse), constant([]));
export const vettedProposalsIsRequesting = isApiRequestingVetted;
export const vettedProposalsError = or(apiInitError, apiVettedError);
export const userProposals = or(compose(get("proposals"), apiUserProposalsResponse), constant(null));
export const userProposalsIsRequesting = isApiRequestingUserProposals;
export const userProposalsError = or(apiInitError, apiUserProposalsError);
export const unvettedProposals = or(compose(get("proposals"), apiUnvettedResponse), constant([]));
const filtered = status => compose(filter(compose(eq(status), get("status"))), unvettedProposals);
export const unreviewedProposals = filtered(PROPOSAL_STATUS_UNREVIEWED);
export const censoredProposals = filtered(PROPOSAL_STATUS_CENSORED);
export const unvettedProposalsIsRequesting = or(isApiRequestingInit, isApiRequestingUnvetted);
export const unvettedProposalsError = or(apiInitError, apiUnvettedError);
export const apiProposal = compose(get("proposal"), apiProposalResponse);
export const proposalPayload = (state) => state.api.proposal.payload;
export const proposalToken = compose(get(["censorshiprecord", "token"]), apiProposal);
export const proposalComments = or(compose(get("comments"), apiProposalCommentsResponse), constant([]));
export const proposalIsRequesting = or(isApiRequestingInit, isApiRequestingProposal);
export const proposalError = or(apiInitError, apiProposalError);
export const newUserResponse = bool(apiNewUserResponse);
export const newProposalIsRequesting = isApiRequestingNewProposal;
export const newProposalError = apiNewProposalError;
export const newProposalMerkle = compose(get(["censorshiprecord", "merkle"]), apiNewProposalResponse);
export const newProposalToken = compose(get(["censorshiprecord", "token"]), apiNewProposalResponse);
export const newProposalSignature = compose(get(["censorshiprecord", "signature"]), apiNewProposalResponse);
export const newProposalName = compose(get("name"), apiNewProposalPayload);
export const newProposalDescription = compose(get("description"), apiNewProposalPayload);
export const newProposalFiles = compose(get("files"), apiNewProposalPayload);
export const setStatusProposal = compose(get("status"), apiSetStatusProposalResponse);
export const setStatusProposalIsRequesting = isApiRequestingSetStatusProposal;
export const setStatusProposalToken = compose(get("token"), apiSetStatusProposalPayload);
export const setStatusProposalError = apiSetStatusProposalError;
export const redirectedFrom = get(["api", "login", "redirectedFrom"]);
export const verificationToken = compose(get("verificationtoken"), apiNewUserResponse);
export const getKeyMismatch = state => state.api.keyMismatch;
export const activeVotes = compose(get("votes"), apiActiveVotesResponse);
export const activeVotesError = apiActiveVotesError;
export const setStartVote = compose(get("startvote"), apiSetStartVoteResponse);
export const voteResultsVote = or(compose(get("vote"), apiVoteResultsResponse), constant({}));
export const voteResultsCastVotes = or(compose(get("castvotes"), apiVoteResultsResponse), constant({}));
export const voteResultsError = apiVoteResultsError;

export const isProposalActive = or(compose(get("token"), voteResultsVote), constant(false));
