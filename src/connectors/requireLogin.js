import { connect } from "react-redux";
import * as sel from "../selectors";

const requireLoginConnector = connect(
  sel.selectorMap({
    loggedInAs: sel.loggedInAs,
    isAdmin: sel.isAdmin,
  })
);

export default requireLoginConnector;
