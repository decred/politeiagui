import {
  selectCurrentUser,
  selectUserError,
  selectUserStatus,
  userLogin,
  userLogout,
  userPasswordRequestReset,
  userSignup,
  userVerificationEmailResend,
  userVerifyEmail,
  userVerifyKey,
} from "./userSlice";

export const user = {
  // Actions
  login: userLogin,
  logout: userLogout,
  signup: userSignup,
  passwordRequest: userPasswordRequestReset,
  resendEmail: userVerificationEmailResend,
  verifyEmail: userVerifyEmail,
  verifyKey: userVerifyKey,
  // Selectors
  selectCurrent: selectCurrentUser,
  selectError: selectUserError,
  selectStatus: selectUserStatus,
};
