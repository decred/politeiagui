import React, { useCallback } from "react";
import { withRouter } from "react-router-dom";
import { Text } from "pi-ui";
import Link from "src/components/Link";
import { PublicProposalsActionsContext, usePublicActions } from "./hooks";
import {
  isAbandonedProposal,
  getProposalToken
} from "src/containers/Proposal/helpers";
import ModalConfirm from "src/components/ModalConfirm";
import ModalConfirmWithReason from "src/components/ModalConfirmWithReason";
import ModalStartVote from "src/components/ModalStartVote";
import useModalContext from "src/hooks/utils/useModalContext";
import values from "lodash/fp/values";
import { shortRecordToken } from "src/helpers";
import {
  VOTE_TYPE_STANDARD,
  VOTE_TYPE_RUNOFF,
  PROPOSAL_STATE_VETTED
} from "src/constants";

const PublicActionsProvider = ({ children, history }) => {
  const {
    onCensorProposal,
    onAbandonProposal,
    onAuthorizeVote,
    onRevokeVote,
    onStartVote,
    onFetchProposalsBatchWithoutState
  } = usePublicActions();

  const [handleOpenModal, handleCloseModal] = useModalContext();

  const handleOpenAbandonModal = useCallback(
    (proposal) => {
      const handleCloseSuccess = () => {
        handleCloseModal();
        history.push(
          `/record/${shortRecordToken(proposal.censorshiprecord.token)}`
        );
      };
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
        onClose: handleCloseModal,
        onCloseSuccess: handleCloseSuccess
      });
    },
    [handleCloseModal, handleOpenModal, onAbandonProposal, history]
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
      const token = getProposalToken(proposal);
      const version = proposal && proposal.version;
      handleOpenModal(ModalStartVote, {
        title: `Start vote - ${proposal.name}`,
        voteType: VOTE_TYPE_STANDARD,
        onSubmit: onStartVote([{ token, version }], VOTE_TYPE_STANDARD),
        successTitle: "Proposal vote started",
        successMessage: (
          <Text>The proposal vote has been successfully started!</Text>
        ),
        onClose: handleCloseModal,
        proposal
      });
    },
    [handleOpenModal, handleCloseModal, onStartVote]
  );

  const handleStartRunoffVoteModal = useCallback(
    async (proposal, cb) => {
      const submissionsTokens = proposal.linkedfrom;
      if (!submissionsTokens || !submissionsTokens.length) {
        throw Error("No RFP submissions available");
      }
      const [submissions] = await onFetchProposalsBatchWithoutState(
        submissionsTokens,
        PROPOSAL_STATE_VETTED
      );
      // Filter abandoned submmsions out & maps to proposal tokens.
      const submissionVotes = values(submissions).flatMap((prop) =>
        isAbandonedProposal(prop)
          ? []
          : [
              {
                token: getProposalToken(prop),
                version: prop.version,
                parent: getProposalToken(proposal)
              }
            ]
      );
      handleOpenModal(ModalStartVote, {
        title: `Start runoff vote - ${proposal.name}`,
        voteType: VOTE_TYPE_RUNOFF,
        onSubmit: onStartVote(submissionVotes, VOTE_TYPE_RUNOFF, cb),
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
      onStartVote,
      handleCloseModal,
      handleOpenModal,
      onFetchProposalsBatchWithoutState
    ]
  );

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
          under <Link to="/admin/records?tab=censored">Censored</Link> tab among
          Admin Proposals.
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
        onStartVote: handleStartVoteModal,
        onCensor: handleOpenCensorModal,
        onStartRunoffVote: handleStartRunoffVoteModal
      }}>
      {children}
    </PublicProposalsActionsContext.Provider>
  );
};

export default withRouter(PublicActionsProvider);
