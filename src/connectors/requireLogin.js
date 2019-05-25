import { connect } from "react-redux";
import * as sel from "../selectors";
import { redirectedFrom } from "../actions/api";

const requireLoginConnector = connect(
  sel.selectorMap({
    loggedInAsEmail: sel.loggedInAsEmail,
    isAdmin: sel.isAdmin,
    apiMeResponse: sel.apiMeResponse,
    apiLoginResponse: sel.apiLoginResponse,
    openedModals: sel.getopenedModals
  }),
  { redirectedFrom }
);

export default requireLoginConnector;
