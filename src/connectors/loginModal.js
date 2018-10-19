import { connect } from "react-redux";
import * as act from "../actions";
import * as sel from "../selectors";

export default connect(
  sel.selectorMap({
    loggedInAsEmail: sel.loggedInAsEmail
  }),
  {
    redirectedFrom: act.redirectedFrom,
    resetRedirectFrom: act.resetRedirectedFrom
  }
);
