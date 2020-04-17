import { useMemo } from "react";
import * as act from "src/actions";
import { useSelector, useAction } from "src/redux";
import * as sel from "src/selectors";

export default function useFaucet() {
  const currentUserID = useSelector(sel.currentUserID);
  const isTestnet = useSelector(sel.isTestNet);
  const isApiRequestingPayWithFaucet = useSelector(
    sel.isApiRequestingPayWithFaucet
  );
  const proposalPaywallPaymentTxidSelector = useMemo(
    () => sel.makeGetPaywallTxid(currentUserID),
    [currentUserID]
  );
  const proposalPaywallPaymentTxid = useSelector(
    proposalPaywallPaymentTxidSelector
  );
  const paywallFaucetTxidSelector = useMemo(
    () => sel.makeGetPaywallFaucetTxid(currentUserID),
    [currentUserID]
  );
  const paywallFaucetTxid = useSelector(paywallFaucetTxidSelector);
  const payWithFaucetError = useSelector(sel.payWithFaucetError);

  const payWithFaucet = useAction(act.payWithFaucet);
  const resetFaucet = useAction(act.resetPaywallPaymentWithFaucet);

  const paymentTxid = paywallFaucetTxid || proposalPaywallPaymentTxid;

  return {
    isTestnet,
    isApiRequestingPayWithFaucet,
    payWithFaucetTxId: paymentTxid,
    payWithFaucetError,
    payWithFaucet,
    resetFaucet
  };
}
