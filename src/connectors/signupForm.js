import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as sel from "../selectors";
import * as act from "../actions";
import { or } from "../lib/fp";

const signupFormConnector = connect(
  sel.selectorMap({
    email: sel.email,
    isApiRequestingNewUser: or(sel.isApiRequestingInit, sel.isApiRequestingNewUser),
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
