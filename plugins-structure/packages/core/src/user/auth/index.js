import {
  selectAuthError,
  selectAuthStatus,
  selectCurrentUser,
  selectVerificationToken,
  userLogin,
  userSignup,
} from "./userAuthSlice";

export const userAuth = {
  login: userLogin,
  signup: userSignup,
  selectCurrent: selectCurrentUser,
  selectVerificationToken: selectVerificationToken,
  selectError: selectAuthError,
  selectStatus: selectAuthStatus,
};
