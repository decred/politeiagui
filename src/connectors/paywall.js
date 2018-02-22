import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as sel from "../selectors";
import * as act from "../actions";

export default connect(
  sel.selectorMap({
    loggedIn: sel.loggedIn,
    paywallAddress: sel.paywallAddress,
    paywallAmount: sel.paywallAmount,
    paywallTxNotBefore: sel.paywallTxNotBefore,
    VerificationToken: sel.verificationToken,
    hasPaid: sel.hasPaid,
    isTestnet: sel.isTestNet
  }),
  dispatch => bindActionCreators({
    verifyUserPayment: act.verifyUserPayment,
    payWithFaucet: act.payWithFaucet,
  }, dispatch)
);
