import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as sel from "../selectors";
import * as act from "../actions";

export default connect(
  sel.selectorMap({
    paywallAddress: sel.paywallAddress,
    paywallAmount: sel.paywallAmount,
    VerificationToken: sel.verificationToken,
    hasPaid: sel.hasPaid,
    isTestnet: sel.isTestNet
  }),
  dispatch => bindActionCreators({
    getPaymentsByAddress: act.getPaymentsByAddress,
    payWithFaucet: act.payWithFaucet,
  }, dispatch)
);
