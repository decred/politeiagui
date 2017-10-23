import { connect } from "react-redux";
import * as sel from "../selectors";
import { redirectedFrom } from "../actions/api";

const requireLoginConnector = connect(
  sel.selectorMap({
    loggedInAs: sel.loggedInAs,
    isAdmin: sel.isAdmin,
  }),
  { redirectedFrom }
);

export default requireLoginConnector;
