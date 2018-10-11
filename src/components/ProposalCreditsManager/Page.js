import React from "react";
import ProposalCreditsSummary from "./Summary";
import { PageLoadingIcon } from "../snew";

class ProposalCreditsPage extends React.Component {
  componentDidMount() {
    this.props.onPurchaseProposalCredits();
  }
  render () {
    const {
      proposalCreditPrice,
      isApiRequestingProposalPaywall,
      proposalCredits,
      proposalCreditPurchases,

      // Testnet only
      isTestnet,
      proposalPaywallPaymentTxid,
      ...props
    } = this.props;
    return isApiRequestingProposalPaywall ?
      <PageLoadingIcon />
      : (
        <div className="proposal-paywall-section">
          <ProposalCreditsSummary
            proposalCreditPrice={proposalCreditPrice}
            proposalCredits={proposalCredits}
            proposalCreditPurchases={proposalCreditPurchases}
            isTestnet={isTestnet}
            { ...{ ...props, proposalPaywallPaymentTxid }}
          />
        </div>
      );
  }
}

export default ProposalCreditsPage;
