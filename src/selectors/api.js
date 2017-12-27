import get from "lodash/fp/get";
import eq from "lodash/fp/eq";
import filter from "lodash/fp/filter";
import compose from "lodash/fp/compose";
import { and, or, bool, constant } from "../lib/fp";
import { PROPOSAL_STATUS_UNREVIEWED, PROPOSAL_STATUS_CENSORED } from "../constants";

const getIsApiRequesting = key => bool(get(["api", key, "isRequesting"]));
const getApiPayload = key => get(["api", key, "payload"]);
const getApiResponse = key => get(["api", key, "response"]);
const getApiError = key => get(["api", key, "error"]);

export const isApiRequestingInit = getIsApiRequesting("init");
const isApiRequestingPolicy = getIsApiRequesting("policy");
export const isApiRequestingNewUser = getIsApiRequesting("newUser");
export const isApiRequestingChangePassword = getIsApiRequesting("changePassword");
export const isApiRequestingVerifyNewUser = getIsApiRequesting("verifyNewUser");
export const isApiRequestingLogin = getIsApiRequesting("login");
export const isApiRequestingLogout = getIsApiRequesting("logout");
export const isApiRequestingForgottenPassword = getIsApiRequesting("forgottenPassword");
export const isApiRequestingPasswordReset = getIsApiRequesting("passwordReset");
const isApiRequestingVetted = getIsApiRequesting("vetted");
const isApiRequestingUnvetted = getIsApiRequesting("unvetted");
const isApiRequestingProposal = getIsApiRequesting("proposal");
const isApiRequestingNewProposal = getIsApiRequesting("newProposal");
export const isApiRequestingNewComment = getIsApiRequesting("newComment");
export const isApiRequestingSetStatusProposal = getIsApiRequesting("setStatusProposal");
export const isApiRequesting = or(
  isApiRequestingInit,
  isApiRequestingPolicy,
  isApiRequestingNewUser,
  isApiRequestingVerifyNewUser,
  isApiRequestingLogin,
  isApiRequestingLogout,
  isApiRequestingVetted,
  isApiRequestingProposal,
  isApiRequestingNewProposal,
  isApiRequestingNewComment,
  isApiRequestingSetStatusProposal
);

const apiNewUserPayload = getApiPayload("newUser");
const apiLoginPayload = getApiPayload("login");
const apiForgottenPasswordPayload = getApiPayload("forgottenPassword");
const apiNewProposalPayload = getApiPayload("newProposal");
const apiSetStatusProposalPayload = getApiPayload("setStatusProposal");

const apiMeResponse = getApiResponse("me");
const apiInitResponse = getApiResponse("init");
const apiPolicyResponse = getApiResponse("policy");
const apiNewUserResponse = getApiResponse("newUser");
export const apiChangePasswordResponse = getApiResponse("changePassword");
const apiLoginResponse = getApiResponse("login");
export const forgottenPasswordResponse = getApiResponse("forgottenPassword");
export const passwordResetResponse = getApiResponse("passwordReset");
const apiVettedResponse = getApiResponse("vetted");
const apiUnvettedResponse = getApiResponse("unvetted");
const apiProposalResponse = getApiResponse("proposal");
const apiProposalCommentsResponse = getApiResponse("proposalComments");
const apiNewProposalResponse = getApiResponse("newProposal");
const apiSetStatusProposalResponse = getApiResponse("setStatusProposal");

const apiInitError = getApiError("init");
export const apiNewUserError = or(apiInitError, getApiError("newUser"));
export const apiChangePasswordError = or(apiInitError, getApiError("changePassword"));
export const apiVerifyNewUserError = or(apiInitError, getApiError("verifyNewUser"));
export const apiForgottenPasswordError = or(apiInitError, getApiError("forgottenPassword"));
export const apiPasswordResetError = or(apiInitError, getApiError("passwordReset"));
export const apiLoginError = or(apiInitError, getApiError("login"));
export const apiLogoutError = or(apiInitError, getApiError("logout"));
const apiVettedError = getApiError("vetted");
const apiUnvettedError = getApiError("unvetted");
const apiProposalError = getApiError("proposal");
const apiNewProposalError = getApiError("newProposal");
const apiSetStatusProposalError = getApiError("setStatusProposal");
export const apiError = or(
  apiInitError,
  apiNewUserError,
  apiChangePasswordError,
  apiVerifyNewUserError,
  apiLoginError,
  apiLogoutError,
  apiVettedError,
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
export const loggedIn = or(
  compose(get("email"), apiMeResponse),
  compose(eq(1), get("errorcode"), apiLoginResponse)
);
export const loggedInAs = and(email, loggedIn);
export const isAdmin = bool(or(
  compose(get("isadmin"), apiMeResponse),
  compose(get("isadmin"), apiLoginResponse)
));
export const policy = apiPolicyResponse;
export const isLoadingSubmit = or(isApiRequestingPolicy, isApiRequestingInit);
export const vettedProposals = or(compose(get("proposals"), apiVettedResponse), constant([]));
export const vettedProposalsIsRequesting = isApiRequestingVetted;
export const vettedProposalsError = or(apiInitError, apiVettedError);
export const unvettedProposals = or(compose(get("proposals"), apiUnvettedResponse), constant([]));
const filtered = status => compose(filter(compose(eq(status), get("status"))), unvettedProposals);
export const unreviewedProposals = filtered(PROPOSAL_STATUS_UNREVIEWED);
export const censoredProposals = filtered(PROPOSAL_STATUS_CENSORED);
export const unvettedProposalsIsRequesting = or(isApiRequestingInit, isApiRequestingUnvetted);
export const unvettedProposalsError = or(apiInitError, apiUnvettedError);
export const proposal = compose(get("proposal"), apiProposalResponse);
export const proposalPayload = (state) => state.api.proposal.payload;
export const proposalToken = compose(get(["censorshiprecord", "token"]), proposal);
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
export const paywallAddress = compose(get("paywallAddress"), apiNewUserResponse);
export const paywallAmount = compose(get("paywallAmount"), apiNewUserResponse);
export const VerificationToken = compose(get("verificationToken"), apiNewUserResponse);
