import React, { useState } from "react";
import { useUnvettedActions, UnvettedProposalsActionsContext } from "./hooks";
import ModalConfirmWithReason from "src/componentsv2/ModalConfirmWithReason";
import ModalConfirm from "src/componentsv2/ModalConfirm";
import useBooleanState from "src/hooks/utils/useBooleanState";

const UnvettedActionsProvider = ({ children }) => {
  const [targetProposal, setTargetProposal] = useState("");
  const { onCensorProposal, onApproveProposal } = useUnvettedActions();
  const [showCensorModal, openCensorModal, closeCensorModal] = useBooleanState(
    false
  );
  const [
    showApproveModal,
    openApproveModal,
    closeApproveModal
  ] = useBooleanState(false);

  // set the proposal target before executing the function
  const withProposalTarget = fn => proposal => {
    setTargetProposal(proposal);
    fn();
  };

  return (
    <UnvettedProposalsActionsContext.Provider
      value={{
        onCensor: withProposalTarget(openCensorModal),
        onApprove: withProposalTarget(openApproveModal)
      }}
    >
      <>
        {children}
        <ModalConfirmWithReason
          title={`Censor proposal - ${targetProposal.name}`}
          reasonLabel="Censor reason"
          subject="censorProposal"
          onSubmit={onCensorProposal(targetProposal)}
          show={showCensorModal}
          onClose={closeCensorModal}
        />
        <ModalConfirm
          title={`Approve proposal - ${targetProposal.name}`}
          message="Are you sure you want to approve this proposal?"
          onSubmit={onApproveProposal(targetProposal)}
          show={showApproveModal}
          onClose={closeApproveModal}
        />
      </>
    </UnvettedProposalsActionsContext.Provider>
  );
};

export default UnvettedActionsProvider;
