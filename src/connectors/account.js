import { connect } from "react-redux";
import * as sel from "../selectors";
import { onUpdateUserKey } from "../actions/api";

export default connect(
  sel.selectorMap({
    loggedInAsEmail: sel.loggedInAsEmail,
    userAlreadyPaid: sel.userAlreadyPaid,
    paywallAddress: sel.paywallAddress,
    paywallAmount: sel.paywallAmount,
    paywallTxNotBefore: sel.paywallTxNotBefore,
    keyMismatch: sel.getKeyMismatch,
    updateUserKey: sel.updateUserKey,
    updateUserKeyError: sel.updateUserKeyError,
  }),
  { onUpdateUserKey }
);
