import { connect } from "react-redux";
import * as sel from "../selectors";

export default connect(
  sel.selectorMap({
    loggedInAs: sel.loggedInAs,
  })
);
