import React from "react";
import Message from "../Message";
import ProposalCreditsSummary from "./Summary";
import ButtonWithLoadingIcon from "../snew/ButtonWithLoadingIcon";
import { multiplyFloatingNumbers } from "../../helpers";
import { PageLoadingIcon } from "../snew";
import { CONFIRMATIONS_REQUIRED } from "../../constants";

class ProposalCreditsPage extends React.Component {
  state = { showBuyingMessage: false }
  componentDidMount() {
    this.props.onPurchaseProposalCredits();
  }
  handlePurchaseCreditsClick = () => this.setState({ showBuyingMessage: !this.state.showBuyingMessage })
  handleBuyWithFaucetClick = () => {
    const {
      payWithFaucet,
      numCreditsToPurchase,
      proposalCreditPrice,
      proposalPaywallAddress
    } = this.props;

    this.setState({ showBuyingMessage: false });

    payWithFaucet(proposalPaywallAddress,
      multiplyFloatingNumbers(numCreditsToPurchase, proposalCreditPrice));

  }
  render () {
    const {
      proposalPaywallAddress,
      proposalCreditPrice,
      proposalPaywallError,
      isApiRequestingProposalPaywall,
      userCanExecuteActions,
      proposalCredits,
      proposalCreditPurchases,

      // Testnet only
      isTestnet,
      numCreditsToPurchase,
      onUpdateCreditsToPurchase,
      isApiRequestingPayWithFaucet,
      payWithFaucetTxId,
      payWithFaucetError,
      proposalPaywallPaymentTxid,
      ...props
    } = this.props;
    return isApiRequestingProposalPaywall ?
      <PageLoadingIcon />
      : (
        <div className="proposal-paywall-section">
          <p>
          Proposal credits are needed to submit proposals, and each proposal requires
          1 credit. Click the button below to receive instructions on how to pay for
          proposal credits.
          </p>
          {(isApiRequestingPayWithFaucet || payWithFaucetTxId || !userCanExecuteActions) &&
        <p>
          <b>Note:</b> You must pay the registration fee and the public key on
          the Politeia server must be the same from the key on your browser before you
          can purchase proposal credits.
        </p>}
          <ProposalCreditsSummary
            proposalCreditPrice={proposalCreditPrice}
            proposalCredits={proposalCredits}
            proposalCreditPurchases={proposalCreditPurchases}
            isTestnet={isTestnet}
            { ...{ ...props, proposalPaywallPaymentTxid }}
          />
          <ButtonWithLoadingIcon
            className="c-btn c-btn-primary"
            text="Purchase credits"
            disabled={isApiRequestingProposalPaywall || proposalPaywallPaymentTxid}
            isLoading={isApiRequestingProposalPaywall}
            onClick={this.handlePurchaseCreditsClick}
          />
          {proposalPaywallPaymentTxid ?
            <span>Do not send any other transactions until the current payment is confirmed</span>
            : null
          }
          {proposalPaywallAddress && this.state.showBuyingMessage && !proposalPaywallPaymentTxid && (
            <Message
              type="info"
              className="proposal-paywall-message"
              header="How to pay for proposal credits"
              body={(
                <div>
                  <p>
                  To purchase proposal credits, please send{" "}
                    <span className="paywall-amount">{proposalCreditPrice} DCR</span>{" "}
                  per credit, for as many credits as you want, to{" "}
                    <span className="paywall-address">{proposalPaywallAddress}</span>.
                  </p>
                  <p>
                  Politeia automatically checks for a transaction sent to this address.
                  After you send it and it reaches {CONFIRMATIONS_REQUIRED} confirmations, you will be granted
                  the number of proposal credits you paid for.
                  </p>
                  <p style={{ marginTop: "24px" }}>
                    <b>Note:</b> Make sure to only send<b> 1 transaction to the address per time</b>, and
                  also send an exact amount. Any amount that is not a multiple of{" "}
                    {proposalCreditPrice} DCR will be rounded down to the closest number
                  of proposal credits.
                  </p>
                  {isTestnet ? (
                    <div className="paywall-faucet">
                      <div className="paywall-faucet-testnet">Testnet</div>
                      <p>
                      This Politeia instance is running on Testnet, which means you can pay
                      with the Decred faucet:
                      </p>
                      <div>
                        <input
                          className="proposal-credits-input"
                          type="number"
                          disabled={isApiRequestingPayWithFaucet || payWithFaucetTxId || !userCanExecuteActions}
                          value={numCreditsToPurchase}
                          onChange={onUpdateCreditsToPurchase} />
                        <ButtonWithLoadingIcon
                          className="c-btn c-btn-primary"
                          text="Buy credits with faucet"
                          disabled={isApiRequestingPayWithFaucet || payWithFaucetTxId || !userCanExecuteActions}
                          isLoading={isApiRequestingPayWithFaucet}
                          onClick={this.handleBuyWithFaucetClick} />
                      </div>
                      {payWithFaucetError ? (
                        <Message
                          type="error"
                          header="Faucet error"
                          body={payWithFaucetError} />
                      ) : null}
                      {payWithFaucetTxId ? (
                        <Message
                          type="info"
                          header="Sent payment">
                        Sent transaction{" "}
                          <a
                            className="paywall-payment-sent"
                            href={"https://testnet.dcrdata.org/explorer/tx/" + payWithFaucetTxId}
                            target="_blank" rel="noopener noreferrer">
                            {payWithFaucetTxId}
                          </a>{" "}
                        to the address; it may take a few minutes to be confirmed.
                        </Message>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              )} />
          )}
          {proposalPaywallError && (
            <Message
              type="error"
              header="Loading error"
              body="There was an error loading the proposal credit instructions." />
          )}
        </div>
      );
  }
}

export default ProposalCreditsPage;
