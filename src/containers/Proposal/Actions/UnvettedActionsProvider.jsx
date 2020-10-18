import React from "react";
import { useUnvettedActions, UnvettedProposalsActionsContext } from "./hooks";
import { Text } from "pi-ui";
import Link from "src/components/Link";
import ModalConfirmWithReason from "src/components/ModalConfirmWithReason";
import ModalConfirm from "src/components/ModalConfirm";
import useModalContext from "src/hooks/utils/useModalContext";

const UnvettedActionsProvider = ({ children }) => {
  const { onCensorProposal, onApproveProposal } = useUnvettedActions();

  const [handleOpenModal, handleCloseModal] = useModalContext();

  const handleOpenCensorModal = (proposal) => {
    handleOpenModal(ModalConfirmWithReason, {
      title: `Censor proposal - ${proposal.name}`,
      reasonLabel: "Censor reason",
      subject: "censorProposal",
      onSubmit: onCensorProposal(proposal),
      successTitle: "Proposal censored",
      successMessage: (
        <Text>
          The proposal has been successfully censored! Now it will appear under
          under{" "}
          <Link to={"/proposals/admin?tab=unvetted censored"}>Censored</Link>{" "}
          tab among Admin Proposals.
        </Text>
      ),
      onClose: handleCloseModal
    });
  };

  const handleOpenApproveModal = (proposal) => {
    handleOpenModal(ModalConfirm, {
      title: `Approve proposal - ${proposal.name}`,
      message: "Are you sure you want to approve this proposal?",
      onSubmit: onApproveProposal(proposal),
      successTitle: "Proposal approved",
      successMessage: (
        <Text>
          The proposal has been successfully approved! Now it will appear under{" "}
          <Link to={"/?tab=in%20discussion"}>In discussion</Link> tab among
          Public Proposals.
        </Text>
      ),
      onClose: handleCloseModal
    });
  };

  return (
    <UnvettedProposalsActionsContext.Provider
      value={{
        onCensor: handleOpenCensorModal,
        onApprove: handleOpenApproveModal
      }}>
      {children}
    </UnvettedProposalsActionsContext.Provider>
  );
};

export default UnvettedActionsProvider;
