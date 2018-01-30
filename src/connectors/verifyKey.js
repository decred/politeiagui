import { connect } from "react-redux";
import * as act from "../actions";
import * as sel from "../selectors";

const verifyKeyConnector = connect(
  sel.selectorMap({
    email: sel.loggedInAs,
    verifyUserKey: sel.verifyUserKey,
    verifyUserKeyError: sel.verifyUserKeyError
  }),
  { onVerify: act.onVerifyUserKey }
);

export default verifyKeyConnector;
