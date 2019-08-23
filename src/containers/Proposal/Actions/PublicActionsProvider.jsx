import React, { useState } from "react";
import { PublicProposalsActionsContext, usePublicActions } from "./hooks";
import ModalConfirm from "src/componentsv2/ModalConfirm";
import ModalConfirmWithReason from "src/componentsv2/ModalConfirmWithReason";
import ModalStartVote from "src/componentsv2/ModalStartVote";
import useBooleanState from "src/hooks/utils/useBooleanState";

const PublicActionsProvider = ({ children }) => {
  const [targetProposal, setTargetProposal] = useState("");
  const {
    onAbandonProposal,
    onAuthorizeVote,
    onRevokeVote,
    onStartVote
  } = usePublicActions();
  const [
    showAbandonModal,
    openAbandonModal,
    closeAbandonModal
  ] = useBooleanState(false);
  const [
    showAuthorizeVoteModal,
    openAuthorizeVoteModal,
    closeAuthorizeVoteModal
  ] = useBooleanState(false);
  const [
    showRevokeVoteModal,
    openRevokeVoteModal,
    closeRevokeVoteModal
  ] = useBooleanState(false);
  const [
    showStartVoteModal,
    openStartVoteModal,
    closeStartVoteModal
  ] = useBooleanState(false);
  // set the proposal target before executing the function
  const withProposalTarget = fn => proposal => {
    setTargetProposal(proposal);
    fn();
  };

  return (
    <PublicProposalsActionsContext.Provider
      value={{
        onAbandon: withProposalTarget(openAbandonModal),
        onAuthorizeVote: withProposalTarget(openAuthorizeVoteModal),
        onRevokeVote: withProposalTarget(openRevokeVoteModal),
        onStartVote: withProposalTarget(openStartVoteModal)
      }}
    >
      <>
        {children}
        <ModalConfirmWithReason
          title={`Abandon - ${targetProposal.name}`}
          reasonLabel="Abandon reason"
          subject="abandonProposal"
          onSubmit={onAbandonProposal(targetProposal)}
          successMessage="Proposal abandoned!"
          show={showAbandonModal}
          onClose={closeAbandonModal}
        />
        <ModalConfirm
          title={`Authorize vote - ${targetProposal.name}`}
          message="Are you sure you want to authorize the vote start?"
          onSubmit={onAuthorizeVote(targetProposal)}
          successMessage="Proposal vote authorized!"
          show={showAuthorizeVoteModal}
          onClose={closeAuthorizeVoteModal}
        />
        <ModalConfirm
          title={`Revoke vote - ${targetProposal.name}`}
          message="Are you sure you want to revoke the vote start?"
          onSubmit={onRevokeVote(targetProposal)}
          successMessage="Proposal vote revoked!"
          show={showRevokeVoteModal}
          onClose={closeRevokeVoteModal}
        />
        <ModalStartVote
          title={`Start vote - ${targetProposal.name}`}
          onSubmit={onStartVote(targetProposal)}
          successMessage="Proposal vote started!"
          show={showStartVoteModal}
          onClose={closeStartVoteModal}
        />
      </>
    </PublicProposalsActionsContext.Provider>
  );
};

export default PublicActionsProvider;
