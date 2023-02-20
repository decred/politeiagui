import {
  selectAuthError,
  selectAuthStatus,
  selectCurrentUser,
  selectVerificationToken,
  userFetchMe,
  userLogin,
  userLogout,
  userSignup,
  userVerifyEmail,
} from "./userAuthSlice";

export const userAuth = {
  fetchMe: userFetchMe,
  login: userLogin,
  logout: userLogout,
  signup: userSignup,
  verifyEmail: userVerifyEmail,
  selectCurrent: selectCurrentUser,
  selectVerificationToken: selectVerificationToken,
  selectError: selectAuthError,
  selectStatus: selectAuthStatus,
};
