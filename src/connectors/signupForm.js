import { connect } from "preact-redux";
import { bindActionCreators } from "redux";
import * as sel from "../selectors";
import * as act from "../actions";

const signupFormConnector = connect(
  sel.selectorMap({
    email: sel.email,
    isApiRequestingNewUser: sel.isApiRequestingNewUser,
    isApiRequestingVerifyNewUser: sel.isApiRequestingVerifyNewUser,
    apiNewUserError: sel.apiNewUserError,
    apiVerifyNewUserError: sel.apiVerifyNewUserError
  }),
  dispatch => bindActionCreators({
    onSetEmail: act.onSetEmail,
    onCancelSignup: act.onCancelSignup
  }, dispatch)
);

export default signupFormConnector;
