import React, { useCallback } from "react";
import { Text } from "pi-ui";
import Link from "src/components/Link";
import { PublicProposalsActionsContext, usePublicActions } from "./hooks";
import { isAbandonedProposal } from "src/containers/Proposal/helpers";
import ModalConfirm from "src/components/ModalConfirm";
import ModalConfirmWithReason from "src/components/ModalConfirmWithReason";
import ModalStartVote from "src/components/ModalStartVote";
import useModalContext from "src/hooks/utils/useModalContext";
import { VOTE_TYPE_STANDARD, VOTE_TYPE_RUNOFF } from "src/constants";

const PublicActionsProvider = ({ children }) => {
  const {
    onAbandonProposal,
    onAuthorizeVote,
    onRevokeVote,
    onStartVote,
    onStartRunoffVote,
    onFetchProposalsBatchWithoutState
  } = usePublicActions();

  const [handleOpenModal, handleCloseModal] = useModalContext();

  const handleOpenAbandonModal = useCallback(
    (proposal) => {
      handleOpenModal(ModalConfirmWithReason, {
        title: `Abandon - ${proposal.name}`,
        reasonLabel: "Abandon reason",
        subject: "abandonProposal",
        onSubmit: onAbandonProposal(proposal),
        successTitle: "Proposal abandoned",
        successMessage: (
          <Text>
            The proposal has been successfully abandoned! Now it will appear
            under the <Link to="/?tab=abandoned">Abandoned</Link> tab.
          </Text>
        ),
        onClose: handleCloseModal
      });
    },
    [handleCloseModal, handleOpenModal, onAbandonProposal]
  );

  const handleOpenAuthorizeVoteModal = useCallback(
    (proposal) => {
      handleOpenModal(ModalConfirm, {
        title: `Authorize vote - ${proposal.name}`,
        message: "Are you sure you want to authorize the vote start?",
        onSubmit: onAuthorizeVote(proposal),
        successTitle: "Proposal vote authorized",
        successMessage: (
          <Text>
            The proposal vote has been successfully authorized! Wait for an
            admin to start the vote for this proposal.
          </Text>
        ),
        onClose: handleCloseModal
      });
    },
    [handleOpenModal, handleCloseModal, onAuthorizeVote]
  );

  const handleOpenRevokeVoteModal = useCallback(
    (proposal) => {
      handleOpenModal(ModalConfirm, {
        title: `Revoke vote - ${proposal.name}`,
        message: "Are you sure you want to revoke the vote start?",
        onSubmit: onRevokeVote(proposal),
        successTitle: "Proposal vote revoked",
        successMessage: (
          <Text>
            The proposal vote has been successfully revoked! Now the admins
            cannot start the vote for this proposal until you authorize it
            again.
          </Text>
        ),
        onClose: handleCloseModal
      });
    },
    [handleCloseModal, handleOpenModal, onRevokeVote]
  );

  const handleStartVoteModal = useCallback(
    (proposal) => {
      handleOpenModal(ModalStartVote, {
        title: `Start vote - ${proposal.name}`,
        voteType: VOTE_TYPE_STANDARD,
        onSubmit: onStartVote(proposal),
        successTitle: "Proposal vote started",
        successMessage: (
          <Text>
            The proposal vote has been successfully started! Now it will appear
            under the <Link to="/?tab=voting">Voting</Link> tab.
          </Text>
        ),
        onClose: handleCloseModal,
        proposal
      });
    },
    [handleOpenModal, handleCloseModal, onStartVote]
  );

  const handleStartRunoffVoteModal = useCallback(
    async (proposal, cb) => {
      const [submissions] = await onFetchProposalsBatchWithoutState(
        proposal.linkedfrom
      );
      // Filter abandoned submmsions out.
      const publicSubmissions = submissions.filter(
        (prop) => !isAbandonedProposal(prop)
      );
      const submissionVotes = publicSubmissions.map(
        ({ censorshiprecord: { token } = { token: null }, version }) => ({
          token,
          proposalversion: version
        })
      );
      handleOpenModal(ModalStartVote, {
        title: `Start runoff vote - ${proposal.name}`,
        voteType: VOTE_TYPE_RUNOFF,
        onSubmit: onStartRunoffVote(
          proposal.censorshiprecord.token,
          submissionVotes,
          cb
        ),
        successTitle: "Proposal runoff vote started",
        message: "Are you sure you want to start runoff vote?",
        successMessage: (
          <Text>
            RFP runoff vote has been successfully started! Now RFP's submissions
            will appear under the <Link to="/?tab=voting">Voting</Link> tab.
          </Text>
        ),
        onClose: handleCloseModal,
        proposal
      });
    },
    [
      handleCloseModal,
      handleOpenModal,
      onStartRunoffVote,
      onFetchProposalsBatchWithoutState
    ]
  );

  return (
    <PublicProposalsActionsContext.Provider
      value={{
        onAbandon: handleOpenAbandonModal,
        onAuthorizeVote: handleOpenAuthorizeVoteModal,
        onRevokeVote: handleOpenRevokeVoteModal,
        onStartVote: handleStartVoteModal,
        onStartRunoffVote: handleStartRunoffVoteModal
      }}>
      {children}
    </PublicProposalsActionsContext.Provider>
  );
};

export default PublicActionsProvider;
