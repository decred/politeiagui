import React from "react";
import { useCredits } from "../hooks.js";
import ModalBuyProposalCredits from "src/components/ModalBuyProposalCredits";
import ModalPayPaywall from "src/components/ModalPayPaywall";
import { getProposalCreditsPaymentStatus } from "../helpers.js";

export default ({
  user,
  showPaywallModal,
  closePaywallModal,
  showProposalCreditsModal,
  closeProposalCreditsModal
}) => {
  const userID = user && user.userid;
  const {
    proposalCreditPrice,
    proposalPaywallAddress,
    proposalPaywallPaymentConfirmations,
    proposalPaywallPaymentTxid,
    pollingCreditsPayment,
    toggleCreditsPaymentPolling,
    onPollProposalPaywallPayment,
    toggleProposalPaymentReceived
  } = useCredits(userID);

  const onStartPollingPayment = () => {
    toggleCreditsPaymentPolling(true);
    onPollProposalPaywallPayment(false);
  };

  const customCloseProposalCreditsModal = () => {
    toggleProposalPaymentReceived(false);
    closeProposalCreditsModal();
  };

  return (
    <>
      <ModalPayPaywall
        show={showPaywallModal}
        title="Complete your registration"
        onClose={closePaywallModal}
      />
      <ModalBuyProposalCredits
        show={showProposalCreditsModal}
        title="Purchase Proposal Credits"
        price={proposalCreditPrice}
        address={proposalPaywallAddress}
        startPollingPayment={onStartPollingPayment}
        status={getProposalCreditsPaymentStatus(
          proposalPaywallPaymentConfirmations,
          proposalPaywallPaymentTxid
        )}
        initialStep={proposalPaywallPaymentTxid ? 1 : 0}
        isPollingCreditsPayment={pollingCreditsPayment}
        onClose={customCloseProposalCreditsModal}
      />
    </>
  );
};
