import { connect } from "react-redux";
import * as sel from "../selectors";
import { withRouter } from "react-router-dom";
import { onUpdateUserKey } from "../actions/api";
import { onIdentityImported } from "../actions/app";
import { bindActionCreators } from "redux";
import { confirmWithModal } from "../actions/modal";
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
  identityImportError: sel.identityImportError,
  identityImportSuccess: sel.identityImportSuccess,
  userPubkey: sel.userPubkey
}), dispatch => bindActionCreators({
  onUpdateUserKey,
  onIdentityImported,
  confirmWithModal
}, dispatch)
);

export default compose(withRouter, accountConnector);
