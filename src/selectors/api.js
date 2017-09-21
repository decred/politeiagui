import { or } from "../lib/fp";


const getIsApiRequesting = key => state =>
  state.api[key] ? state.api[key].isRequesting : null;
const getApiResponse = key => state =>
  state.api[key] ? state.api[key].response : null;
const getApiError = key => state =>
  state.api[key] ? state.api[key].error : null;

export const isApiRequestingInit = getIsApiRequesting("init");
export const isApiRequestingNewUser = getIsApiRequesting("newUser");
export const isApiRequestingVerifyNewUser = getIsApiRequesting("verifyNewUser");
export const isApiRequestingLogin = getIsApiRequesting("login");
export const isApiRequestingLogout = getIsApiRequesting("logout");
export const isApiRequesting = or(
  isApiRequestingInit,
  isApiRequestingNewUser,
  isApiRequestingVerifyNewUser,
  isApiRequestingLogin,
  isApiRequestingLogout
);

export const apiInitResponse = getApiResponse("init");
export const apiNewUserResponse = getApiResponse("newUser");
export const apiVerifyNewUserResponse = getApiResponse("verifyNewUser");
export const apiLoginResponse = getApiResponse("login");
export const apiLogoutResponse = getApiResponse("logout");

export const apiInitError = getApiError("init");
export const apiNewUserError = or(apiInitError, getApiError("newUser"));
export const apiVerifyNewUserError = or(apiInitError, getApiError("verifyNewUser"));
export const apiLoginError = or(apiInitError, getApiError("login"));
export const apiLogoutError = or(apiInitError, getApiError("logout"));
export const apiError = or(
  apiInitError,
  apiNewUserError,
  apiVerifyNewUserError,
  apiLoginError,
  apiLogoutError,
  apiError
);

export const loggedInAs = state =>
  apiLoginResponse(state) ? state.api.login.payload.email : null;

export const email = state => {
  const loggedIn = loggedInAs(state);
  return loggedIn ? loggedIn : state.api.email;
};

export const csrf = state => {
  const response = apiInitResponse(state);
  return response ? response.csrfToken : null;
};

export const vettedProposals = state =>
  (state.api.vetted.response || {}).proposals || [];

export const vettedProposalsIsRequesting = state =>
  state.api.vetted.isRequesting;

export const vettedProposalsError = state =>
  state.api.vetted.error;

export const proposal = state => (state.api.proposal.response || {}).proposal || {};
export const proposalIsRequesting = state => state.api.proposal.isRequesting;
export const proposalError = state => state.api.proposal.error;
