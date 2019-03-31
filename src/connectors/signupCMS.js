import { connect } from "react-redux";
import * as sel from "../selectors";
import * as act from "../actions";
import { or } from "../lib/fp";

const signupCMSFormConnector = connect(
  sel.selectorMap({
    email: sel.email,
    loggedInAsEmail: sel.loggedInAsEmail,
    isAdmin: sel.isAdmin,
    policy: sel.policy,
    newUserResponse: sel.newUserResponse,
    isApiRequestingLogin: sel.isApiRequestingLogin,
    isApiRequestingNewUser: or(
      sel.isApiRequestingInit,
      sel.isApiRequestingNewUser
    ),
    isApiRequestingVerifyNewUser: sel.isApiRequestingVerifyNewUser,
    apiNewUserError: sel.apiNewUserError,
    apiVerifyNewUserError: sel.apiVerifyNewUserError,
    isShowingSignupConfirmation: sel.isShowingSignupConfirmation,
    csrf: sel.csrf,
    isCMS: sel.isCMS
  }),
  {
    onFetchData: act.onGetPolicy,
    onSignup: act.onSignup,
    onSignupConfirm: act.onSignupConfirmCMS,
    onResetSignup: act.onResetSignup
  }
);

export default signupCMSFormConnector;
