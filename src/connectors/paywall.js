import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as sel from "../selectors";

export default connect(
  sel.selectorMap({
    loggedInAsEmail: sel.loggedInAsEmail,
    paywallAddress: sel.paywallAddress,
    paywallAmount: sel.paywallAmount,
    paywallTxNotBefore: sel.paywallTxNotBefore,
    userPaywallStatus: sel.getUserPaywallStatus,
    userPaywallConfirmations: sel.getUserPaywallConfirmations,
    userPaywallTxid: sel.getUserPaywallTxid,
    verificationToken: sel.verificationToken,
    isTestnet: sel.isTestNet
  }),
  dispatch => bindActionCreators({
  }, dispatch)
);
