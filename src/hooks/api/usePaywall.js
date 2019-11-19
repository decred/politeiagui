import * as act from "src/actions";
import { useAction, useSelector } from "src/redux";
import * as sel from "src/selectors";
import { PAYWALL_STATUS_PAID } from "src/constants";
import { useConfig } from "src/Config";

function usePaywall() {
  const currentUserEmail = useSelector(sel.currentUserEmail);
  const paywallAddress = useSelector(sel.currentUserPaywallAddress);
  const paywallAmount = useSelector(sel.currentUserPaywallAmount);
  const paywallTxNotBefore = useSelector(sel.currentUserPaywallTxNotBefore);
  const userPaywallStatus = useSelector(sel.getUserPaywallStatus);
  const userPaywallConfirmations = useSelector(sel.getUserPaywallConfirmations);
  const userPaywallTxid = useSelector(sel.getUserPaywallTxid);
  const userAlreadyPaid = useSelector(sel.getUserAlreadyPaid);
  const verificationToken = useSelector(sel.verificationToken);
  const isTestnet = useSelector(sel.isTestNet);

  const onResetAppPaywallInfo = useAction(act.onResetPaywallInfo);

  const { enablePaywall } = useConfig();

  return {
    currentUserEmail,
    paywallAddress,
    paywallAmount,
    paywallTxNotBefore,
    userPaywallStatus,
    userPaywallConfirmations,
    userPaywallTxid,
    userAlreadyPaid,
    verificationToken,
    isTestnet,
    onResetAppPaywallInfo,
    isPaid: userPaywallStatus === PAYWALL_STATUS_PAID,
    paywallEnabled: enablePaywall
  };
}

export default usePaywall;
