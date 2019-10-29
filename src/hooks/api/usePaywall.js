import * as act from "src/actions";
import { useRedux } from "src/redux";
import * as sel from "src/selectors";
import { PAYWALL_STATUS_PAID } from "src/constants";
import { useConfig } from "src/containers/Config";

const mapStateToProps = {
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
};

const mapDispatchToProps = {
  onResetAppPaywallInfo: act.onResetPaywallInfo
};

function usePaywall(ownProps) {
  const fromRedux = useRedux(ownProps, mapStateToProps, mapDispatchToProps);
  const { enablePaywall } = useConfig();

  return {
    ...fromRedux,
    isPaid: fromRedux.userPaywallStatus === PAYWALL_STATUS_PAID,
    paywallEnabled: enablePaywall
  };
}

export default usePaywall;
