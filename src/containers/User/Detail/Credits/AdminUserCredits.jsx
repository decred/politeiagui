import { Button, Card, classNames, Spinner } from "pi-ui";
import React, { useEffect } from "react";
import ModalConfirmWithReason from "src/componentsv2/ModalConfirmWithReason";
import { MANAGE_USER_CLEAR_USER_PAYWALL } from "src/constants";
import useBooleanState from "src/hooks/utils/useBooleanState";
import { useManageUser } from "../hooks.js";
import usePaywall from "src/hooks/api/usePaywall";
import styles from "./Credits.module.css";
import { useCredits, useRescanUserCredits } from "./hooks.js";
import UserModals from "./components/UserModals";
import RegistrationFeeSection from "./components/RegistrationFeeSection";
import ProposalCreditsSection from "./components/ProposalCreditsSection";
import RescanSection from "./components/RescanSection.jsx";
import CreditHistorySection from "./components/CreditHistorySection.jsx";

const Credits = ({ user }) => {
  const userID = user && user.userid;
  const [markAsPaid, isApiRequestingMarkAsPaid] = useManageUser(
    MANAGE_USER_CLEAR_USER_PAYWALL,
    userID
  );
  const { isPaid } = usePaywall();
  const {
    proposalCreditPrice,
    isApiRequestingUserProposalCredits,
    proposalCredits,
    toggleCreditsPaymentPolling,
    proposalPaymentReceived,
    toggleProposalPaymentReceived,
    onPollProposalPaywallPayment,
    shouldPollPaywallPayment
  } = useCredits({ userid: userID });

  const {
    onRescanUserCredits,
    errorRescan,
    isLoadingRescan,
    amountOfCreditsAddedOnRescan
  } = useRescanUserCredits(userID);

  const [
    showMarkAsPaidConfirmModal,
    openMarkAsPaidModal,
    closeMarkAsPaidModal
  ] = useBooleanState(false);
  const [
    showPaywallModal,
    openPaywallModal,
    closePaywallModal
  ] = useBooleanState(false);
  const [
    showProposalCreditsModal,
    openProposalCreditsModal,
    closeProposalCreditsModal
  ] = useBooleanState(false);

  useEffect(() => {
    if (shouldPollPaywallPayment) {
      toggleCreditsPaymentPolling(true);
      onPollProposalPaywallPayment(true);
    }
  }, [
    shouldPollPaywallPayment,
    onPollProposalPaywallPayment,
    toggleCreditsPaymentPolling
  ]);

  useEffect(() => {
    if (proposalPaymentReceived) {
      toggleCreditsPaymentPolling(false);
      closeProposalCreditsModal();
    }
  }, [
    proposalPaymentReceived,
    toggleProposalPaymentReceived,
    closeProposalCreditsModal,
    toggleCreditsPaymentPolling
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
        openPaywallModal={openPaywallModal}
        isApiRequestingMarkAsPaid={isApiRequestingMarkAsPaid}
        openMarkAsPaidModal={openMarkAsPaidModal}
      />
      <ProposalCreditsSection
        proposalCredits={proposalCredits}
        proposalCreditPrice={proposalCreditPrice}
      />
      <div className={styles.buttonsWrapper}>
        {isPaid && (
          <Button
            className="margin-top-s"
            size="sm"
            onClick={openProposalCreditsModal}>
            Purchase more
          </Button>
        )}
        <Button
          onClick={onRescanUserCredits}
          loading={isLoadingRescan}
          className="margin-top-s"
          size="sm">
          Rescan
        </Button>
      </div>
      <RescanSection
        amountOfCreditsAddedOnRescan={amountOfCreditsAddedOnRescan}
        errorRescan={errorRescan}
      />
      <CreditHistorySection
        user={user}
        proposalCreditPrice={proposalCreditPrice}
      />
      <ModalConfirmWithReason
        subject="markUserPaywallAsPaid"
        onSubmit={markAsPaid}
        show={showMarkAsPaidConfirmModal}
        title="Mark user paywall as paid"
        successTitle="Paywall marked as paid"
        successMessage="The user paywall was successfully marked as paid!"
        onClose={closeMarkAsPaidModal}
      />
      <UserModals
        user={user}
        showPaywallModal={showPaywallModal}
        closePaywallModal={closePaywallModal}
        showProposalCreditsModal={showProposalCreditsModal}
        closeProposalCreditsModal={closeProposalCreditsModal}
      />
    </Card>
  );
};

export default Credits;
