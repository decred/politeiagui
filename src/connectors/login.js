import { connect } from "react-redux";
import * as sel from "../selectors";
import * as act from "../actions";

const loginConnector = connect(
  sel.selectorMap({
    loggedInAs: sel.loggedInAs,
    loggedIn: sel.loggedIn,
    email: sel.email,
    isAdmin: sel.isAdmin,
    newUserResponse: sel.newUserResponse,
    redirectedFrom: sel.redirectedFrom,
  }),
  {
    onLogin: act.onLogin,
    onSignup: act.onSignup,
    onResetNewUser: act.onResetNewUser,
    resetRedirectedFrom: act.resetRedirectedFrom,
  }
);

export default loginConnector;
