import React from "react";
import { useManageUser } from "../../hooks.js";
import { useCredits } from "../hooks.js";
import ModalBuyProposalCredits from "src/componentsv2/ModalBuyProposalCredits";
import ModalPayPaywall from "src/componentsv2/ModalPayPaywall";
import { getProposalCreditsPaymentStatus } from "../helpers.js";

export default ({ showPaywallModal, closePaywallModal, showProposalCreditsModal, closeProposalCreditsModal }) => {
  const { user } = useManageUser();
  const {
    proposalCreditPrice,
    proposalPaywallAddress,
    proposalPaywallPaymentConfirmations,
    proposalPaywallPaymentTxid,
    pollingCreditsPayment,
    toggleCreditsPaymentPolling,
    onPollProposalPaywallPayment,
    toggleProposalPaymentReceived
  } = useCredits({ userid: user.id });

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
