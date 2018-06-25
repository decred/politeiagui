import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as sel from "../selectors";
import * as act from "../actions";

export default connect(
  sel.selectorMap({
    loggedInAsEmail: sel.loggedInAsEmail,
    paywallAddress: sel.paywallAddress,
    paywallAmount: sel.paywallAmount,
    paywallTxNotBefore: sel.paywallTxNotBefore,
    userPaywallStatus: sel.getUserPaywallStatus,
    userPaywallConfirmations: sel.getUserPaywallConfirmations,
    verificationToken: sel.verificationToken,
    isTestnet: sel.isTestNet,
    isApiRequestingPayWithFaucet: sel.isApiRequestingPayWithFaucet,
    payWithFaucetError: sel.payWithFaucetError
  }),
  dispatch => bindActionCreators({
    payWithFaucet: act.payWithFaucet,
  }, dispatch)
);
