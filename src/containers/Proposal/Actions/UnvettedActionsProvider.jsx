import React, { useState } from "react";
import { useUnvettedActions, UnvettedProposalsActionsContext } from "./hooks";
import { Text } from "pi-ui";
import Link from "src/componentsv2/Link";
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
          successTitle="Proposal censored"
          successMessage={
            <Text>
              The proposal has been successfully censored! Now it will appear
              under under{" "}
              <Link to={"/proposals/unvetted?tab=censored"}>Censored</Link> tab
              among Unvetted Proposals.
            </Text>
          }
          show={showCensorModal}
          onClose={closeCensorModal}
        />
        <ModalConfirm
          title={`Approve proposal - ${targetProposal.name}`}
          message="Are you sure you want to approve this proposal?"
          onSubmit={onApproveProposal(targetProposal)}
          successTitle="Proposal approved"
          successMessage={
            <Text>
              The proposal has been successfully approved! Now it will appear
              under <Link to={"/?tab=in%20discussion"}>In discussion</Link> tab
              among Public Proposals.
            </Text>
          }
          show={showApproveModal}
          onClose={closeApproveModal}
        />
      </>
    </UnvettedProposalsActionsContext.Provider>
  );
};

export default UnvettedActionsProvider;
