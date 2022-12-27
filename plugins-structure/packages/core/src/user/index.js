import {
  selectCurrentUser,
  userLogin,
  userLogout,
  userSignup,
  userVerificationEmailResend,
} from "./userSlice";

export const user = {
  login: userLogin,
  logout: userLogout,
  signup: userSignup,
  resendEmail: userVerificationEmailResend,
  selectCurrent: selectCurrentUser,
};
