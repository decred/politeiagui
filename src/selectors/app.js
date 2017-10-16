import { or } from "../lib/fp";
import * as api from "./api";

export const isShowingSignup = or(
  state => state.app.isShowingSignup && !api.newUserResponse(state),
  api.isApiRequestingNewUser,
  api.isApiRequestingVerifyNewUser,
  api.apiNewUserError,
  api.apiVerifyNewUserError
);
