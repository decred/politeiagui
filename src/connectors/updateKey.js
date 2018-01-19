import { connect } from "react-redux";
import * as sel from "../selectors";
import { onUpdateUserKey } from "../actions/api";

export default connect(
  sel.selectorMap({
    loggedInAs: sel.loggedInAs,
    updateUserKey: sel.updateUserKey,
    updateUserKeyError: sel.updateUserKeyError
  }),
  { onUpdateUserKey }
);
