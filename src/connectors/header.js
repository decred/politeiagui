import { connect } from "react-redux";
import * as sel from "../selectors";
import { bindActionCreators } from "redux";
import * as act from "../actions";

export default connect(
  sel.selectorMap({
    loggedInAs: sel.loggedInAs,
    isAdmin: sel.isAdmin,
    hasPaid: sel.hasPaid,
    paywallAddress: sel.paywallAddress,
    paywallAmount: sel.paywallAmount,
    paywallTxNotBefore: sel.paywallTxNotBefore,
  }),
  dispatch => bindActionCreators({
    verifyUserPayment: act.verifyUserPayment,
  }, dispatch)
);
