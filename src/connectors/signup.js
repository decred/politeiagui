import { connect } from "react-redux";
import * as sel from "../selectors";
import * as act from "../actions";
import { or } from "../lib/fp";
import compose from "lodash/fp/compose";
import { reduxForm } from "redux-form";
import validate from "../components/Signup/SignupValidator";

const signupFormConnector = connect(
  sel.selectorMap({
    loggedInAs: sel.loggedInAs,
    isApiRequestingNewUser: or(sel.isApiRequestingInit, sel.isApiRequestingNewUser),
    isApiRequestingVerifyNewUser: sel.isApiRequestingVerifyNewUser,
    apiNewUserError: sel.apiNewUserError,
    apiVerifyNewUserError: sel.apiVerifyNewUserError
  }),
  {
    onSignup: act.onSignup,
    onCancelSignup: act.onCancelSignup
  }
);

export default compose(reduxForm({ form: "form/signup", validate }), signupFormConnector);

