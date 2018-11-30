import React from "react";
import ProposalCreditsSummary from "./Summary";

class ProposalCreditsPage extends React.Component {
  componentDidMount() {
    this.props.onPurchaseProposalCredits();
  }
  render() {
    const {
      proposalCreditPrice,
      proposalCredits,
      isApiRequestingUserProposalCredits,

      // Testnet only
      isTestnet,
      proposalPaywallPaymentTxid,
      ...props
    } = this.props;

    // adds registration fee to history table
    const proposalCreditPurchases = this.props.proposalCreditPurchases.unshift({
      numberPurchased: "N/A",
      price: "click on the transaction link for more information",
      confirming: false,
      type: "fee",
      txId: this.props.paywallTxid
    });

    return (
      !isApiRequestingUserProposalCredits && (
        <div className="proposal-paywall-section">
          <ProposalCreditsSummary
            proposalCreditPrice={proposalCreditPrice}
            proposalCredits={proposalCredits}
            proposalCreditPurchases={proposalCreditPurchases}
            isTestnet={isTestnet}
            {...{ ...props, proposalPaywallPaymentTxid }}
          />
        </div>
      )
    );
  }
}

export default ProposalCreditsPage;
