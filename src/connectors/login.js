import { connect } from "react-redux";
import * as sel from "../selectors";
import * as act from "../actions";

const loginConnector = connect(
  sel.selectorMap({
    loggedInAs: sel.loggedInAs,
    loggedIn: sel.loggedIn,
    email: sel.email,
    isAdmin: sel.isAdmin,
    redirectedFrom: sel.redirectedFrom,
  }),
  {
    onLogin: act.onLogin,
    resetRedirectedFrom: act.resetRedirectedFrom,
  }
);

export default loginConnector;
