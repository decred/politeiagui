import React from "react";
import { Text } from "pi-ui";
import Link from "src/components/Link";
import { PublicProposalsActionsContext, usePublicActions } from "./hooks";
import ModalConfirm from "src/components/ModalConfirm";
import ModalConfirmWithReason from "src/components/ModalConfirmWithReason";
import ModalStartVote from "src/components/ModalStartVote";
import useModalContext from "src/hooks/utils/useModalContext";

const PublicActionsProvider = ({ children }) => {
  const {
    onAbandonProposal,
    onAuthorizeVote,
    onRevokeVote,
    onStartVote
  } = usePublicActions();

  const [handleOpenModal, handleCloseModal] = useModalContext();

  const handleOpenAbandonModal = (proposal) => {
    handleOpenModal(ModalConfirmWithReason, {
      title: `Abandon - ${proposal.name}`,
      reasonLabel: "Abandon reason",
      subject: "abandonProposal",
      onSubmit: onAbandonProposal(proposal),
      successTitle: "Proposal abandoned",
      successMessage: (
        <Text>
          The proposal has been successfully abandoned! Now it will appear under
          the <Link to="/?tab=abandoned">Abandoned</Link> tab.
        </Text>
      ),
      onClose: handleCloseModal
    });
  };

  const handleOpenAuthorizeVoteModal = (proposal) => {
    handleOpenModal(ModalConfirm, {
      title: `Authorize vote - ${proposal.name}`,
      message: "Are you sure you want to authorize the vote start?",
      onSubmit: onAuthorizeVote(proposal),
      successTitle: "Proposal vote authorized",
      successMessage: (
        <Text>
          The proposal vote has been successfully authorized! Wait for an admin
          to start the vote for this proposal.
        </Text>
      ),
      onClose: handleCloseModal
    });
  };

  const handleOpenRevokeVoteModal = (proposal) => {
    handleOpenModal(ModalConfirm, {
      title: `Revoke vote - ${proposal.name}`,
      message: "Are you sure you want to revoke the vote start?",
      onSubmit: onRevokeVote(proposal),
      successTitle: "Proposal vote revoked",
      successMessage: (
        <Text>
          The proposal vote has been successfully revoked! Now the admins cannot
          start the vote for this proposal until you authorize it again.
        </Text>
      ),
      onClose: handleCloseModal
    });
  };

  const handleStartVoteModal = (proposal) => {
    handleOpenModal(ModalStartVote, {
      title: `Start vote - ${proposal.name}`,
      onSubmit: onStartVote(proposal),
      successTitle: "Proposal vote started",
      successMessage: (
        <Text>
          The proposal vote has been successfully started! Now it will appear
          under the <Link to="/?tab=voting">Voting</Link> tab.
        </Text>
      ),
      onClose: handleCloseModal
    });
  };

  return (
    <PublicProposalsActionsContext.Provider
      value={{
        onAbandon: handleOpenAbandonModal,
        onAuthorizeVote: handleOpenAuthorizeVoteModal,
        onRevokeVote: handleOpenRevokeVoteModal,
        onStartVote: handleStartVoteModal
      }}>
      {children}
    </PublicProposalsActionsContext.Provider>
  );
};

export default PublicActionsProvider;
