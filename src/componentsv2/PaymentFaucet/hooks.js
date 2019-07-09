import * as act from "src/actions";
import { useRedux } from "src/redux";
import * as sel from "src/selectors";

const mapStateToProps = {
  isTestnet: sel.isTestNet,
  isApiRequestingPayWithFaucet: sel.isApiRequestingPayWithFaucet,
  payWithFaucetTxId: sel.payWithFaucetTxId,
  payWithFaucetError: sel.payWithFaucetError
};

const mapDispatchToProps = {
  payWithFaucet: act.payWithFaucet,
  resetFaucet: act.resetPaywallPaymentWithFaucet
};

export default function useFaucet(ownProps) {
  const { policy, ...fromRedux } = useRedux(
    ownProps,
    mapStateToProps,
    mapDispatchToProps
  );

  return { ...fromRedux, policy };
}
