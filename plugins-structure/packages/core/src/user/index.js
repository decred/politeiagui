import {
  selectCurrentUser,
  userLogin,
  userLogout,
  userPasswordRequestReset,
  userSignup,
  userVerificationEmailResend,
  userVerifyEmail,
} from "./userSlice";

export const user = {
  login: userLogin,
  logout: userLogout,
  signup: userSignup,
  passwordRequest: userPasswordRequestReset,
  resendEmail: userVerificationEmailResend,
  verifyEmail: userVerifyEmail,
  selectCurrent: selectCurrentUser,
};
