import { connect } from "preact-redux";
import * as sel from "../selectors";

const requireLoginConnector = connect(
  sel.selectorMap({
    loggedInAs: sel.loggedInAs
  })
);

export default requireLoginConnector;
