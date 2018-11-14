import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as act from "../actions";
import * as sel from "../selectors";

const verifyKeyConnector = connect(
  sel.selectorMap({
    email: sel.loggedInAsEmail,
    verifyUserKey: sel.verifyUserKey,
    apiMeResponse: sel.apiMeResponse,
    loggedInAsEmail: sel.loggedInAsEmail,
    verifyUserKeyError: sel.verifyUserKeyError,
    keyMismatch: sel.getKeyMismatch,
    userPubkey: sel.userPubkey
  }),
  dispatch =>
    bindActionCreators(
      {
        onVerifyUserKey: act.onVerifyUserKey,
        updateMe: act.updateMe,
        keyMismatchAction: act.keyMismatch
      },
      dispatch
    )
);

export default verifyKeyConnector;
