import React from "react";
import proposalCreditsConnector from "../../connectors/proposalCredits";
import PaymentInfo from "../PaymentInfo";
import PaymentFaucet from "../PaymentFaucet";
import Message from "../Message";
import { PAYWALL_STATUS_WAITING, PAYWALL_STATUS_LACKING_CONFIRMATIONS } from "../../constants";
import { multiplyFloatingNumbers } from "../../helpers";

// define purchase steps
const SELECT_AMOUNT = 0;
const PAYMENT_INFO  = 1;

const SelectAmountContent = ({
  onUpdateCreditsToPurchase,
  numCreditsToPurchase,
  proposalCreditPrice
}) => {
  return (
    <React.Fragment>
      <span style={{ fontSize: "16px" }}>How many credits do you want to buy?</span>
      <span>*each proposal credit costs {proposalCreditPrice}dcr</span>
      <input
        className="proposal-credits-input"
        type="number"
        value={numCreditsToPurchase}
        onChange={onUpdateCreditsToPurchase} />
    </React.Fragment>
  );
};

const PaymentInfoContent = ({
  address,
  amount,
  numCreditsToPurchase,
  paymentStatus,
  confirmations,
  proposalPaywallPaymentTxid,
  displayFaucet,
  isTestnet
}) => {
  const isWaitingConfirmation = paymentStatus === PAYWALL_STATUS_LACKING_CONFIRMATIONS;
  return (
    <React.Fragment>
      <span style={{ alignSelft: "left", fontSize: "16px", width: "100%", marginBottom: "20px" }}>
        {!isWaitingConfirmation ?
          `To complete the purchase of ${numCreditsToPurchase} credit(s), please follow the instructions below:` :
          "Your payment has been detected. You proposal credits will be updated once it reaches the required number of confirmations."
        }
      </span>
      <PaymentInfo
        amount={amount}
        paywallAddress={address}
        paywallStatus={paymentStatus}
        paywallTxid={proposalPaywallPaymentTxid}
        paywallConfirmations={confirmations}
        isTestnet={isTestnet}
      />
      {displayFaucet ? <PaymentFaucet
        paywallAddress={address}
        paywallAmount={amount}
      /> : null}
    </React.Fragment>
  );
};

class Purchase extends React.Component {
  constructor(props) {
    super(props);
    const awaitingConfirmations = props.proposalPaywallPaymentTxid;
    this.state = {
      step: awaitingConfirmations ?  PAYMENT_INFO : SELECT_AMOUNT,
      numCreditsToPurchase: 1
    };
  }

  onUpdateCreditsToPurchase = (event) => {
    const numCreditsToPurchase = parseInt(event.target.value, 10);
    if (numCreditsToPurchase < 1) {
      return;
    }
    this.setState({ numCreditsToPurchase });
  }

  componentDidUpdate(_, prevState) {
    const {
      pollyingCreditsPayment,
      proposalPaywallAddress,
      proposalPaymentReceived
    } = this.props;

    const changedToPaymentInfoStep = (
      prevState.step !== this.state.step &&
      this.state.step === PAYMENT_INFO
    );
    const changedToSelectAmountStep = (
      prevState.step !== this.state.step &&
      this.state.step === SELECT_AMOUNT
    );

    if (changedToPaymentInfoStep &&
        !pollyingCreditsPayment && proposalPaywallAddress) {
      this.props.toggleCreditsPaymentPolling(true);
    }

    if (changedToSelectAmountStep && proposalPaymentReceived) {
      // reset payment received message
      this.props.toggleProposalPaymentReceived(false);
    }
  }

  componentDidMount() {
    if(this.props.proposalPaymentReceived) {
      this.props.toggleProposalPaymentReceived(false);
    }
    if(this.props.proposalPaywallAddress && !this.props.pollyingCreditsPayment) {
      this.props.toggleCreditsPaymentPolling(true);
    }
  }

  goToStep = (step) =>
    this.setState({ step })

  render() {
    const { step, numCreditsToPurchase } = this.state;
    const {
      proposalCreditPrice,
      proposalPaywallAddress,
      proposalPaywallPaymentTxid,
      proposalPaywallPaymentConfirmations,
      isTestnet,
      proposalPaymentReceived
    } = this.props;

    const isSelectAmountStep = step === SELECT_AMOUNT;
    const isPaymentInfoStep = step === PAYMENT_INFO;
    const paymentStatus = proposalPaywallPaymentTxid ? PAYWALL_STATUS_LACKING_CONFIRMATIONS : PAYWALL_STATUS_WAITING;
    const amount = multiplyFloatingNumbers(proposalCreditPrice, numCreditsToPurchase);
    const awaitingConfirmations = proposalPaywallPaymentTxid;

    return (
      <div className="modal-content__wrapper purchase-credits">
        <div
          className="purchase-credits__content"
        >
          { isSelectAmountStep ?
            <SelectAmountContent
              onUpdateCreditsToPurchase={this.onUpdateCreditsToPurchase}
              numCreditsToPurchase={numCreditsToPurchase}
              proposalCreditPrice={proposalCreditPrice}
            />
            :
            proposalPaymentReceived ?
              <Message
                type="success"
                className="account-page-message"
                header="Payment received"
                body={(
                  <p>Thank you for your payment, your credits were updated!</p>
                )} /> :
              <PaymentInfoContent
                amount={amount}
                address={proposalPaywallAddress}
                numCreditsToPurchase={numCreditsToPurchase}
                paymentStatus={paymentStatus}
                confirmations={proposalPaywallPaymentConfirmations}
                displayFaucet={!awaitingConfirmations}
                proposalPaywallPaymentTxid={proposalPaywallPaymentTxid}
                isTestnet={isTestnet}
              />
          }
        </div>
        <div className="purchase-credits__buttons">
          {isPaymentInfoStep && !proposalPaymentReceived ?
            <button
              className={`left ${awaitingConfirmations ? "disabled" : ""}`}
              disabled={awaitingConfirmations}
              onClick={() => this.goToStep(SELECT_AMOUNT)}
            >
              Previous
            </button> : null}
          {isSelectAmountStep ?
            <button
              className="right"
              disabled={numCreditsToPurchase < 1}
              onClick={() => this.goToStep(PAYMENT_INFO)}
            >
              Next
            </button> : null}
        </div>
      </div>
    );
  }
}

export default proposalCreditsConnector(Purchase);
