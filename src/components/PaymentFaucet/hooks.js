import * as act from "src/actions";
import { useSelector, useAction } from "src/redux";
import * as sel from "src/selectors";

export default function useFaucet() {
  const isTestnet = useSelector(sel.isTestNet);
  const isApiRequestingPayWithFaucet = useSelector(
    sel.isApiRequestingPayWithFaucet
  );
  const payWithFaucetTxId = useSelector(sel.payWithFaucetTxId);
  const payWithFaucetError = useSelector(sel.payWithFaucetError);

  const payWithFaucet = useAction(act.payWithFaucet);
  const resetFaucet = useAction(act.resetPaywallPaymentWithFaucet);
  return {
    isTestnet,
    isApiRequestingPayWithFaucet,
    payWithFaucetTxId,
    payWithFaucetError,
    payWithFaucet,
    resetFaucet
  };
}
