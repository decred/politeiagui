import { useMemo } from "react";
import * as act from "src/actions";
import * as sel from "src/selectors";
import { useAction, useSelector } from "src/redux";
import { useConfig } from "src/Config";

function usePaywall() {
  const currentUserEmail = useSelector(sel.currentUserEmail);
  const currentUserID = useSelector(sel.currentUserID);
  const paywallAddress = useSelector(sel.currentUserPaywallAddress);
  const paywallAmount = useSelector(sel.currentUserPaywallAmount);
  const paywallTxNotBefore = useSelector(sel.currentUserPaywallTxNotBefore);
  const userIsPaidSelector = useMemo(
    () => sel.makeGetUserIsPaid(currentUserID),
    [currentUserID]
  );
  const userPaywallStatusSelector = useMemo(
    () => sel.makeGetPaywallAddress(currentUserID),
    [currentUserID]
  );
  const userIsPaid = useSelector(userIsPaidSelector);
  const userPaywallStatus = useSelector(userPaywallStatusSelector);
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
    verificationToken,
    isTestnet,
    onResetAppPaywallInfo,
    isPaid: userIsPaid,
    paywallEnabled: enablePaywall
  };
}

export default usePaywall;
