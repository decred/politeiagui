import React from "react";
import ProposalCreditsSummary from "./Summary";
import { PageLoadingIcon } from "../snew";
import { PAYWALL_REGISTER_FEE_AMOUNT } from "../../constants";

class ProposalCreditsPage extends React.Component {
  componentDidMount() {
    this.props.onPurchaseProposalCredits();
  }
  render () {
    const {
      proposalCreditPrice,
      isApiRequestingProposalPaywall,
      proposalCredits,

      // Testnet only
      isTestnet,
      proposalPaywallPaymentTxid,
      ...props
    } = this.props;

    const proposalCreditPurchases = this.props.proposalCreditPurchases.unshift({
      numberPurchased: 1,
      price: PAYWALL_REGISTER_FEE_AMOUNT,
      confirming: false,
      amount: 1,
      type: "fee",
      txId: this.props.paywallTxid
    });

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
