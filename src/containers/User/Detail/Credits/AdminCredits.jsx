import { Button, Card, classNames } from "pi-ui";
import React from "react";
import ModalConfirmWithReason from "src/components/ModalConfirmWithReason";
import { MANAGE_USER_CLEAR_USER_PAYWALL } from "src/constants";
import useManageUser from "../hooks/useManageUser";
import usePaywall from "src/hooks/api/usePaywall";
import { useCredits, useRescanUserCredits } from "./hooks.js";
import RegistrationFeeSection from "./components/RegistrationFeeSection";
import ProposalCreditsSection from "./components/ProposalCreditsSection";
import RescanSection from "./components/RescanSection.jsx";
import useModalContext from "src/hooks/utils/useModalContext";

const Credits = ({ user }) => {
  const userID = user && user.userid;
  const [markAsPaid, isApiRequestingMarkAsPaid] = useManageUser(
    MANAGE_USER_CLEAR_USER_PAYWALL,
    userID
  );
  const { isPaid } = usePaywall(userID);
  const { proposalCredits, proposalCreditPrice } = useCredits(userID);
  const {
    onRescanUserCredits,
    errorRescan,
    isLoadingRescan,
    amountOfCreditsAddedOnRescan
  } = useRescanUserCredits(userID);

  const [handleOpenModal, handleCloseModal] = useModalContext();

  const handleOpenMarkAsPaid = () => {
    handleOpenModal(ModalConfirmWithReason, {
      subject: "markUserPaywallAsPaid",
      onSubmit: markAsPaid,
      title: "Mark user paywall as paid",
      successTitle: "Paywall marked as paid",
      successMessage: "The user paywall was successfully marked as paid!",
      onClose: handleCloseModal
    });
  };

  return (
    <Card className={classNames("container", "margin-bottom-m")}>
      <RegistrationFeeSection
        isPaid={isPaid}
        isAdmin
        isUser={false}
        isApiRequestingMarkAsPaid={isApiRequestingMarkAsPaid}
        openMarkAsPaidModal={handleOpenMarkAsPaid}
      />
      <ProposalCreditsSection
        proposalCredits={proposalCredits}
        proposalCreditPrice={proposalCreditPrice}
      />
      <Button
        data-testid="rescan-credits"
        onClick={onRescanUserCredits}
        loading={isLoadingRescan}
        className="margin-top-s"
        size="sm"
      >
        Rescan
      </Button>
      <RescanSection
        amountOfCreditsAddedOnRescan={amountOfCreditsAddedOnRescan}
        errorRescan={errorRescan}
      />
    </Card>
  );
};

export default Credits;
