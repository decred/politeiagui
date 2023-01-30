import {
  selectAuthError,
  selectCurrentUser,
  userLogin,
  userSignup,
} from "./userAuthSlice";

export const userAuth = {
  login: userLogin,
  signup: userSignup,
  selectCurrent: selectCurrentUser,
  selectError: selectAuthError,
};
