import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as act from "../actions";
import * as sel from "../selectors";

export default connect(
  sel.selectorMap({
    userPubkey: sel.userPubkey,
    loggedInAsEmail: sel.loggedInAsEmail,
    apiError: sel.apiError,
    userCanExecuteActions: sel.userCanExecuteActions,
  }),
  dispatch => bindActionCreators({
    onInit: act.requestApiInfo,
    keyMismatchAction: act.keyMismatch,
    openModal: act.openModal
  }, dispatch)
);
