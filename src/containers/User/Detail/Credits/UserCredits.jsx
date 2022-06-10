import { Button, Card, classNames, Spinner } from "pi-ui";
import React, { useEffect } from "react";
import usePaywall from "src/hooks/api/usePaywall";
import styles from "./Credits.module.css";
import { useCredits } from "./hooks.js";
import RegistrationFeeSection from "./components/RegistrationFeeSection";
import ProposalCreditsSection from "./components/ProposalCreditsSection";
import CreditHistorySection from "./components/CreditHistorySection.jsx";
import { useUserPaymentModals } from "./hooks";

const Credits = ({ user }) => {
  const userID = user && user.userid;
  const { isPaid, paywallEnabled } = usePaywall(userID);
  const {
    proposalCreditPrice,
    isApiRequestingUserProposalCredits,
    proposalCredits,
    toggleCreditsPaymentPolling,
    toggleProposalPaymentReceived,
    proposalPaymentReceived,
    onPollProposalPaywallPayment,
    shouldPollPaywallPayment
  } = useCredits(userID);

  const {
    handleOpenPaywallModal,
    handleOpenBuyCreditsModal,
    handleCloseModal
  } = useUserPaymentModals(user);

  useEffect(() => {
    if (shouldPollPaywallPayment) {
      toggleCreditsPaymentPolling(true);
      toggleProposalPaymentReceived(false);
      onPollProposalPaywallPayment(false);
    }
  }, [
    shouldPollPaywallPayment,
    onPollProposalPaywallPayment,
    toggleCreditsPaymentPolling,
    toggleProposalPaymentReceived
  ]);

  useEffect(() => {
    if (proposalPaymentReceived) {
      toggleCreditsPaymentPolling(false);
      handleCloseModal();
    }
  }, [proposalPaymentReceived, toggleCreditsPaymentPolling, handleCloseModal]);

  return isApiRequestingUserProposalCredits ? (
    <div className={styles.spinnerWrapper}>
      <Spinner invert />
    </div>
  ) : (
    <Card className={classNames("container", "margin-bottom-m")}>
      <RegistrationFeeSection
        isPaid={isPaid}
        isAdmin={false}
        isUser
        openPaywallModal={handleOpenPaywallModal}
      />
      <ProposalCreditsSection
        proposalCredits={proposalCredits}
        proposalCreditPrice={proposalCreditPrice}
      />
      {isPaid && paywallEnabled && (
        <Button
          className="margin-top-s"
          size="sm"
          onClick={handleOpenBuyCreditsModal}
        >
          Purchase more
        </Button>
      )}
      <CreditHistorySection
        user={user}
        proposalCreditPrice={proposalCreditPrice}
      />
    </Card>
  );
};

export default Credits;
