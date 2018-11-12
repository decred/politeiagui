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
    userPaywallTxid: sel.getUserPaywallTxid,
    userAlreadyPaid: sel.getUserAlreadyPaid,
    verificationToken: sel.verificationToken,
    isTestnet: sel.isTestNet
  }),
  dispatch =>
    bindActionCreators(
      {
        onResetAppPaywallInfo: act.onResetPaywallInfo
      },
      dispatch
    )
);
