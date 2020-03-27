import React, { useState } from "react";
import { Text } from "pi-ui";
import Link from "src/components/Link";
import { PublicProposalsActionsContext, usePublicActions } from "./hooks";
import ModalConfirm from "src/components/ModalConfirm";
import ModalConfirmWithReason from "src/components/ModalConfirmWithReason";
import ModalStartVote from "src/components/ModalStartVote";
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
          successTitle="Proposal abandoned"
          successMessage={
            <Text>
              The proposal has been successfully abandoned! Now it will appear
              under the <Link to="/?tab=abandoned">Abandoned</Link> tab.
            </Text>
          }
          show={showAbandonModal}
          onClose={closeAbandonModal}
        />
        <ModalConfirm
          title={`Authorize vote - ${targetProposal.name}`}
          message="Are you sure you want to authorize the vote start?"
          onSubmit={onAuthorizeVote(targetProposal)}
          successTitle="Proposal vote authorized"
          successMessage={
            <Text>
              The proposal vote has been successfully authorized! Wait for an
              admin to start the vote for this proposal.
            </Text>
          }
          show={showAuthorizeVoteModal}
          onClose={closeAuthorizeVoteModal}
        />
        <ModalConfirm
          title={`Revoke vote - ${targetProposal.name}`}
          message="Are you sure you want to revoke the vote start?"
          onSubmit={onRevokeVote(targetProposal)}
          successTitle="Proposal vote revoked"
          successMessage={
            <Text>
              The proposal vote has been successfully revoked! Now the admins
              cannot start the vote for this proposal until you authorize it
              again.
            </Text>
          }
          show={showRevokeVoteModal}
          onClose={closeRevokeVoteModal}
        />
        <ModalStartVote
          title={`Start vote - ${targetProposal.name}`}
          onSubmit={onStartVote(targetProposal)}
          successTitle="Proposal vote started"
          successMessage={
            <Text>
              The proposal vote has been successfully started! Now it will
              appear under the <Link to="/?tab=voting">Voting</Link> tab.
            </Text>
          }
          show={showStartVoteModal}
          onClose={closeStartVoteModal}
        />
      </>
    </PublicProposalsActionsContext.Provider>
  );
};

export default PublicActionsProvider;
