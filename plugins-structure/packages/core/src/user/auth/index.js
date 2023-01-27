import { selectAuthError, selectCurrentUser, userLogin } from "./userAuthSlice";

export const userAuth = {
  login: userLogin,
  selectCurrent: selectCurrentUser,
  selectError: selectAuthError,
};
