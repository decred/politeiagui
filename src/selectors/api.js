import get from "lodash/fp/get";
import compose from "lodash/fp/compose";
import { or, bool, constant } from "../lib/fp";


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
  apiLogoutError
);

export const loggedInAs = state =>
  apiLoginResponse(state) ? state.api.login.payload.email : null;

export const email = state => {
  const loggedIn = loggedInAs(state);
  return loggedIn ? loggedIn : state.api.email;
};

export const csrf = compose(get("csrfToken"), apiInitResponse);
export const vettedProposals = or(get(["api", "vetted", "response", "proposals"]), constant([]));
export const vettedProposalsIsRequesting = bool(get(["api", "vetted", "isRequesting"]));
export const vettedProposalsError = get(["api", "vetted", "error"]);
export const proposal = or(get(["api", "proposal", "response", "proposal"]), constant({}));
export const proposalIsRequesting = bool(get(["api", "proposal", "isRequesting"]));
export const proposalError = get(["api", "proposal", "error"]);
export const newProposalIsRequesting = bool(get(["api", "newProposal", "isRequesting"]));
export const newProposalError = get(["api", "newProposal", "error"]);
export const newProposalMerkle = get(["api", "newProposal", "response", "merkle"]);
export const newProposalToken = get(["api", "newProposal", "response", "token"]);
export const newProposalSignature = get(["api", "newProposal", "response", "signature"]);
