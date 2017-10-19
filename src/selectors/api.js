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
export const isApiRequestingVerifyNewUser = getIsApiRequesting("verifyNewUser");
export const isApiRequestingLogin = getIsApiRequesting("login");
export const isApiRequestingLogout = getIsApiRequesting("logout");
const isApiRequestingVetted = getIsApiRequesting("vetted");
const isApiRequestingUnvetted = getIsApiRequesting("unvetted");
const isApiRequestingProposal = getIsApiRequesting("proposal");
const isApiRequestingNewProposal = getIsApiRequesting("newProposal");
export const isApiRequesting = or(
  isApiRequestingInit,
  isApiRequestingPolicy,
  isApiRequestingNewUser,
  isApiRequestingVerifyNewUser,
  isApiRequestingLogin,
  isApiRequestingLogout,
  isApiRequestingVetted,
  isApiRequestingProposal,
  isApiRequestingNewProposal
);

const apiNewUserPayload = getApiPayload("newUser");
const apiLoginPayload = getApiPayload("login");
const apiNewProposalPayload = getApiPayload("newProposal");

const apiInitResponse = getApiResponse("init");
const apiPolicyResponse = getApiResponse("policy");
const apiNewUserResponse = getApiResponse("newUser");
const apiLoginResponse = getApiResponse("login");
const apiVettedResponse = getApiResponse("vetted");
const apiUnvettedResponse = getApiResponse("unvetted");
const apiProposalResponse = getApiResponse("proposal");
const apiNewProposalResponse = getApiResponse("newProposal");
const apiSetStatusProposalResponse = getApiResponse("setStatusProposal");

const apiInitError = getApiError("init");
export const apiNewUserError = or(apiInitError, getApiError("newUser"));
export const apiVerifyNewUserError = or(apiInitError, getApiError("verifyNewUser"));
export const apiLoginError = or(apiInitError, getApiError("login"));
export const apiLogoutError = or(apiInitError, getApiError("logout"));
const apiVettedError = getApiError("vetted");
const apiUnvettedError = getApiError("unvetted");
const apiProposalError = getApiError("proposal");
const apiNewProposalError = getApiError("newProposal");
export const apiError = or(
  apiInitError,
  apiNewUserError,
  apiVerifyNewUserError,
  apiLoginError,
  apiLogoutError,
  apiVettedError,
  apiProposalError,
  apiNewProposalError
);

export const csrf = compose(get("csrfToken"), apiInitResponse);
export const email = or(
  compose(get("email"), apiLoginPayload),
  compose(get("email"), apiNewUserPayload)
);
export const loggedIn = compose(eq(1), get("errorcode"), apiLoginResponse);
export const loggedInAs = and(email, loggedIn);

export const isAdmin = bool(compose(get("isadmin"), apiLoginResponse));
export const policy = apiPolicyResponse;
export const policyIsRequesting = isApiRequestingPolicy;
export const vettedProposals = or(compose(get("proposals"), apiVettedResponse), constant([]));
export const vettedProposalsIsRequesting = or(isApiRequestingInit, isApiRequestingVetted);
export const vettedProposalsError = or(apiInitError, apiVettedError);
export const unvettedProposals = or(compose(get("proposals"), apiUnvettedResponse), constant([]));
const filtered = status => compose(filter(compose(eq(status), get("status"))), unvettedProposals);
export const unreviewedProposals = filtered(PROPOSAL_STATUS_UNREVIEWED);
export const censoredProposals = filtered(PROPOSAL_STATUS_CENSORED);
export const unvettedProposalsIsRequesting = or(isApiRequestingInit, isApiRequestingUnvetted);
export const unvettedProposalsError = or(apiInitError, apiUnvettedError);
export const proposal = or(compose(get("proposal"), apiProposalResponse), constant({}));
export const proposalIsRequesting = or(isApiRequestingInit, isApiRequestingProposal);
export const proposalError = or(apiInitError, apiProposalError);
export const newUserResponse = bool(apiNewUserResponse);
export const newProposalIsRequesting = isApiRequestingNewProposal;
export const newProposalError = apiNewProposalError;
export const newProposalMerkle = compose(get("merkle"), apiNewProposalResponse);
export const newProposalToken = compose(get("token"), apiNewProposalResponse);
export const newProposalSignature = compose(get("signature"), apiNewProposalResponse);
export const newProposalName = compose(get("name"), apiNewProposalPayload);
export const newProposalDescription = compose(get("description"), apiNewProposalPayload);
export const newProposalFiles = compose(get("files"), apiNewProposalPayload);
export const setStatusProposal = compose(get("status"), apiSetStatusProposalResponse);
