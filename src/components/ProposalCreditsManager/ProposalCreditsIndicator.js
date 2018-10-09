import React from "react";
import proposalCreditsConnector from "../../connectors/proposalCredits";
import currentUserConnector from "../../connectors/currentUser";
import IntervalComponent from "../IntervalComponent";
import Tooltip from "../Tooltip";
import { PROPOSAL_CREDITS_MODAL, PAYWALL_MODAL } from "../Modal/modalTypes";
import {
  PAYWALL_STATUS_PAID
} from "../../constants";

/**
 * ProposalCreditsIndicator indicates what are the current number of credits owned by the user.
 * It also controls the polling mechanism to check for new payments and payments confirmations.
 */
class ProposalCreditsIndicator extends React.Component {
  componentDidUpdate(prevProps) {
    const {
      proposalPaywallPaymentTxid,
      proposalPaywallAddress
    } = this.props;

    if (prevProps.proposalPaywallPaymentTxid && !proposalPaywallPaymentTxid) {
      // a transaction has been confirmed
      // request the user proposal credits to get it updated
      this.props.onUserProposalCredits();
      // stop polling
      this.props.toggleCreditsPaymentPolling(false);
    }
    if (!prevProps.proposalPaywallAddress && proposalPaywallAddress) {
      // start polling
      this.props.toggleCreditsPaymentPolling(true);
    }
  }
  onFinishInterval = () => {
    if(this.props.pollingCreditsPayment) {
      this.props.toggleCreditsPaymentPolling(false);
    }
  }
  render() {
    const {
      onFetchProposalPaywallPayment,
      proposalCredits,
      userPaywallStatus,
      pollingCreditsPayment,
      proposalPaywallPaymentTxid,
      openModal
    } = this.props;

    const pollingInterval = 5 * 1000; // 5 seconds
    const awaitingConfirmations = proposalPaywallPaymentTxid;

    // if its awaiting confirmations, the polling will be up until the payment
    // is confirmed. Otherwise, it will do 12 attempts to check for new payments
    const numberOfAttempts = awaitingConfirmations ? null : 12;

    return (
      <IntervalComponent
        intervalPeriod={pollingInterval}
        onInterval={onFetchProposalPaywallPayment}
        active={pollingCreditsPayment}
        executeOnIntervalBeforeFirstInterval={true}
        maxNumberOfExecutions={numberOfAttempts}
        onFinishInterval={this.onFinishInterval}
      >
        <Tooltip
          text="Proposal credits are purchased to submit proposals. Click here for more information."
          position="bottom"
        >
          <div className="user-proposal-credits" onClick={() => userPaywallStatus !== PAYWALL_STATUS_PAID
            ? openModal(PAYWALL_MODAL)
            : openModal(PROPOSAL_CREDITS_MODAL)}>
            <div className="proposal-credits-text">{(proposalCredits || 0) + " proposal credit" + (proposalCredits !== 1 ? "s" : "")}</div>
            <span className="proposalc-credits-click-here-text">Click here to buy and update credits</span>
          </div>
        </Tooltip>
      </IntervalComponent>
    );
  }
}

export default proposalCreditsConnector(currentUserConnector(ProposalCreditsIndicator));
