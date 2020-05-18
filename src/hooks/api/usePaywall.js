import { useMemo } from "react";
import * as sel from "src/selectors";
import { useSelector } from "src/redux";
import { useConfig } from "src/containers/Config";

function usePaywall(userID) {
  const currentUserID = useSelector(sel.currentUserID);
  const uuid = userID || currentUserID;
  const currentUserEmail = useSelector(sel.currentUserEmail);
  const paywallAddress = useSelector(sel.currentUserPaywallAddress);
  const paywallAmount = useSelector(sel.currentUserPaywallAmount);
  const paywallTxNotBefore = useSelector(sel.currentUserPaywallTxNotBefore);
  const userIsPaidSelector = useMemo(() => sel.makeGetUserIsPaid(uuid), [uuid]);
  const userPaywallStatusSelector = useMemo(
    () => sel.makeGetPaywallAddress(uuid),
    [uuid]
  );
  const userIsPaid = useSelector(userIsPaidSelector);
  const userPaywallStatus = useSelector(userPaywallStatusSelector);

  const { enablePaywall, enableCredits } = useConfig();

  return {
    currentUserEmail,
    paywallAddress,
    paywallAmount,
    paywallTxNotBefore,
    userPaywallStatus,
    isPaid: userIsPaid,
    paywallEnabled: enablePaywall,
    creditsEnabled: enableCredits
  };
}

export default usePaywall;
