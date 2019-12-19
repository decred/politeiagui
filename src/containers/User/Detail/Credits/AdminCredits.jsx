import { Button, Card, classNames } from "pi-ui";
import React from "react";
import ModalConfirmWithReason from "src/componentsv2/ModalConfirmWithReason";
import { MANAGE_USER_CLEAR_USER_PAYWALL } from "src/constants";
import useBooleanState from "src/hooks/utils/useBooleanState";
import useManageUser from "../hooks/useManageUser";
import usePaywall from "src/hooks/api/usePaywall";
import { useCredits, useRescanUserCredits } from "./hooks.js";
import RegistrationFeeSection from "./components/RegistrationFeeSection";
import ProposalCreditsSection from "./components/ProposalCreditsSection";
import RescanSection from "./components/RescanSection.jsx";

const Credits = ({ user }) => {
  const userID = user && user.userid;
  const [markAsPaid, isApiRequestingMarkAsPaid] = useManageUser(
    MANAGE_USER_CLEAR_USER_PAYWALL,
    userID
  );
  const { isPaid } = usePaywall();
  const { proposalCreditPrice } = useCredits(userID);

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

  return (
    <Card className={classNames("container", "margin-bottom-m")}>
      <RegistrationFeeSection
        isPaid={isPaid}
        isAdmin
        isUser={false}
        isApiRequestingMarkAsPaid={isApiRequestingMarkAsPaid}
        openMarkAsPaidModal={openMarkAsPaidModal}
      />
      <ProposalCreditsSection
        proposalCredits={user.proposalcredits}
        proposalCreditPrice={proposalCreditPrice}
      />
      <Button
        onClick={onRescanUserCredits}
        loading={isLoadingRescan}
        className="margin-top-s"
        size="sm">
        Rescan
      </Button>
      <RescanSection
        amountOfCreditsAddedOnRescan={amountOfCreditsAddedOnRescan}
        errorRescan={errorRescan}
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
    </Card>
  );
};

export default Credits;
