import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as act from "../actions";
import * as sel from "../selectors";

const verifyKeyConnector = connect(
  sel.selectorMap({
    email: sel.loggedInAs,
    verifyUserKey: sel.verifyUserKey,
    apiMeResponse: sel.apiMeResponse,
    loggedInAs: sel.loggedInAs,
    verifyUserKeyError: sel.verifyUserKeyError
  }),
  dispatch => bindActionCreators({ onVerify: act.onVerifyUserKey, updateMe: act.updateMe }, dispatch)
);

export default verifyKeyConnector;
