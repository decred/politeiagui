import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as sel from "../selectors";
import * as act from "../actions";

export default connect(
  sel.selectorMap({
    proposalPaywallAddress: sel.proposalPaywallAddress,
    proposalCreditPrice: sel.proposalCreditPrice,
    proposalPaywallError: sel.proposalPaywallError,
    isApiRequestingProposalPaywall: sel.isApiRequestingProposalPaywall,
    proposalCredits: sel.proposalCredits,
    proposalCreditPurchases: sel.proposalCreditPurchases,
    isApiRequestingUserProposalCredits: sel.isApiRequestingUserProposalCredits,
    userCanExecuteActions: sel.userCanExecuteActions,
    isTestnet: sel.isTestNet,
    isApiRequestingPayWithFaucet: sel.isApiRequestingPayProposalWithFaucet,
    payWithFaucetTxId: sel.payProposalWithFaucetTxId,
    payWithFaucetError: sel.payProposalWithFaucetError
  }),
  dispatch => bindActionCreators({
    onUserProposalCredits: act.onUserProposalCredits,
    payWithFaucet: act.payProposalWithFaucet,
    onPurchaseProposalCredits: act.onFetchProposalPaywallDetails
  }, dispatch)
);
