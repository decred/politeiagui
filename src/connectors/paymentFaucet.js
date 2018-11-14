import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as sel from "../selectors";
import * as act from "../actions";

export default connect(
  sel.selectorMap({
    isTestnet: sel.isTestNet,
    isApiRequestingPayWithFaucet: sel.isApiRequestingPayWithFaucet,
    payWithFaucetTxId: sel.payWithFaucetTxId,
    payWithFaucetError: sel.payWithFaucetError
  }),
  dispatch =>
    bindActionCreators(
      {
        payWithFaucet: act.payWithFaucet,
        resetFaucet: act.resetPaywallPaymentWithFaucet
      },
      dispatch
    )
);
