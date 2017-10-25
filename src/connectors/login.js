import { connect } from "react-redux";
import * as sel from "../selectors";
import * as act from "../actions";
import { or } from "../lib/fp";
import compose from "lodash/fp/compose";
import { reduxForm } from "redux-form";
import validate from "../components/Login/LoginValidator";

const loginConnector = connect(
  sel.selectorMap({
    loggedInAs: sel.loggedInAs,
    loggedIn: sel.loggedIn,
    email: sel.email,
    isAdmin: sel.isAdmin,
    newUserResponse: sel.newUserResponse,
    redirectedFrom: sel.redirectedFrom,
    isApiRequestingLogin: or(sel.isApiRequestingInit, sel.isApiRequestingLogin),
    apiLoginError: sel.apiLoginError
  }),
  {
    onLogin: act.onLogin,
    onSignup: act.onSignup,
    onResetNewUser: act.onResetNewUser,
    resetRedirectedFrom: act.resetRedirectedFrom,
  }
);

export default compose(reduxForm({ form: "form/login", validate }), loginConnector);
