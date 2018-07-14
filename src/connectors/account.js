import { connect } from "react-redux";
import * as sel from "../selectors";
import { withRouter } from "react-router-dom";
import { onUpdateUserKey } from "../actions/api";
import { bindActionCreators } from "redux";
import compose from "lodash/fp/compose";

const accountConnector = connect(sel.selectorMap({
  loggedInAsEmail: sel.loggedInAsEmail,
  userAlreadyPaid: sel.userAlreadyPaid,
  paywallAddress: sel.paywallAddress,
  paywallAmount: sel.paywallAmount,
  paywallTxNotBefore: sel.paywallTxNotBefore,
  keyMismatch: sel.getKeyMismatch,
  updateUserKey: sel.updateUserKey,
  updateUserKeyError: sel.updateUserKeyError,
  verificationToken: sel.verificationToken,
  shouldAutoVerifyKey: sel.shouldAutoVerifyKey,
}), dispatch => bindActionCreators({
  onUpdateUserKey
}, dispatch)
);

export default compose(withRouter, accountConnector);
