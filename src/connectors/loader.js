import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as act from "../actions";
import * as sel from "../selectors";

export default connect(
  sel.selectorMap({
    serverPubkey: sel.serverPubkey,
    loggedInAs: sel.loggedInAs,
    keyMismatch: sel.getKeyMismatch,
    paywallAddress: sel.paywallAddress,
  }),
  dispatch => bindActionCreators({
    onInit: act.onInit,
    keyMismatchAction: act.keyMismatch,
  }, dispatch)
);
