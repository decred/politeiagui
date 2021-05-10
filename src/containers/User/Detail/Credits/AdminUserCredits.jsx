import { Button, Card, classNames, Spinner } from "pi-ui";
import React, { useEffect } from "react";
import ModalConfirmWithReason from "src/components/ModalConfirmWithReason";
import { MANAGE_USER_CLEAR_USER_PAYWALL } from "src/constants";
import useManageUser from "../hooks/useManageUser";
import usePaywall from "src/hooks/api/usePaywall";
import styles from "./Credits.module.css";
import { useCredits, useRescanUserCredits } from "./hooks.js";
import RegistrationFeeSection from "./components/RegistrationFeeSection";
import ProposalCreditsSection from "./components/ProposalCreditsSection";
import RescanSection from "./components/RescanSection.jsx";
import CreditHistorySection from "./components/CreditHistorySection.jsx";
import { useUserPaymentModals } from "./hooks";
import useModalContext from "src/hooks/utils/useModalContext";

const Credits = ({ user }) => {
  const userID = user && user.userid;
  const [markAsPaid, isApiRequestingMarkAsPaid] = useManageUser(
    MANAGE_USER_CLEAR_USER_PAYWALL,
    userID
  );
  const { isPaid, paywallEnabled } = usePaywall(userID);
  const {
    proposalCreditPrice,
    isApiRequestingUserProposalCredits,
    proposalCredits,
    toggleCreditsPaymentPolling,
    proposalPaymentReceived,
    toggleProposalPaymentReceived,
    onPollProposalPaywallPayment,
    shouldPollPaywallPayment
  } = useCredits(userID);

  const {
    onRescanUserCredits,
    errorRescan,
    isLoadingRescan,
    amountOfCreditsAddedOnRescan
  } = useRescanUserCredits(userID);

  useEffect(() => {
    if (shouldPollPaywallPayment) {
      toggleCreditsPaymentPolling(true);
      toggleProposalPaymentReceived(false);
      onPollProposalPaywallPayment(true);
    }
  }, [
    shouldPollPaywallPayment,
    onPollProposalPaywallPayment,
    toggleCreditsPaymentPolling,
    toggleProposalPaymentReceived
  ]);

  const { handleOpenPaywallModal, handleOpenBuyCreditsModal } =
    useUserPaymentModals(user);

  const [handleOpenModal, handleCloseModal] = useModalContext();

  const handleOpenMarkAsPaidModal = () => {
    handleOpenModal(ModalConfirmWithReason, {
      subject: "markUserPaywallAsPaid",
      onSubmit: markAsPaid,
      title: "Mark user paywall as paid",
      successTitle: "Paywall marked as paid",
      successMessage: "The user paywall was successfully marked as paid!",
      onClose: handleCloseModal
    });
  };

  useEffect(() => {
    if (proposalPaymentReceived) {
      toggleCreditsPaymentPolling(false);
      toggleProposalPaymentReceived(false);
      handleCloseModal();
    }
  }, [
    proposalPaymentReceived,
    toggleCreditsPaymentPolling,
    toggleProposalPaymentReceived,
    handleCloseModal
  ]);

  return isApiRequestingUserProposalCredits ? (
    <div className={styles.spinnerWrapper}>
      <Spinner invert />
    </div>
  ) : (
    <Card className={classNames("container", "margin-bottom-m")}>
      <RegistrationFeeSection
        isPaid={isPaid}
        isAdmin
        isUser
        openPaywallModal={handleOpenPaywallModal}
        isApiRequestingMarkAsPaid={isApiRequestingMarkAsPaid}
        openMarkAsPaidModal={handleOpenMarkAsPaidModal}
      />
      <ProposalCreditsSection
        proposalCredits={proposalCredits}
        proposalCreditPrice={proposalCreditPrice}
      />
      <div className={styles.buttonsWrapper}>
        {isPaid && paywallEnabled && (
          <>
            <Button
              className="margin-top-s"
              size="sm"
              onClick={handleOpenBuyCreditsModal}>
              Purchase more
            </Button>
            <Button
              onClick={onRescanUserCredits}
              loading={isLoadingRescan}
              className="margin-top-s"
              size="sm">
              Rescan
            </Button>
          </>
        )}
      </div>
      <RescanSection
        amountOfCreditsAddedOnRescan={amountOfCreditsAddedOnRescan}
        errorRescan={errorRescan}
      />
      <CreditHistorySection
        user={user}
        proposalCreditPrice={proposalCreditPrice}
      />
    </Card>
  );
};

export default Credits;
