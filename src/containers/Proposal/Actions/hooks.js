import { createContext, useContext } from "react";
import { useLoaderContext } from "src/Appv2/Loader";
import {
  PROPOSAL_STATUS_CENSORED,
  PROPOSAL_STATUS_PUBLIC,
  PROPOSAL_STATUS_ABANDONED
} from "src/constants";
import * as act from "src/actions";
import { useRedux } from "src/redux";

export const PublicProposalsActionsContext = createContext();
export const UnvettedProposalsActionsContext = createContext();

export const usePublicProposalActions = () =>
  useContext(PublicProposalsActionsContext);
export const useUnvettedProposalActions = () =>
  useContext(UnvettedProposalsActionsContext);

export function useUnvettedActions() {
  const { onSetProposalStatus } = useRedux(
    {},
    {},
    {
      onSetProposalStatus: act.onSetProposalStatusV2
    }
  );

  const onCensorProposal = proposal => reason =>
    onSetProposalStatus(
      proposal.censorshiprecord.token,
      PROPOSAL_STATUS_CENSORED,
      reason
    );

  const onApproveProposal = proposal => () =>
    onSetProposalStatus(
      proposal.censorshiprecord.token,
      PROPOSAL_STATUS_PUBLIC
    );

  return {
    onCensorProposal,
    onApproveProposal
  };
}

export function usePublicActions() {
  const {
    onSetProposalStatus,
    onStartVote: onStart,
    onAuthorizeVote: onAuthorize,
    onRevokeVote: onRevoke
  } = useRedux(
    {},
    {},
    {
      onStartVote: act.onStartVote,
      onAuthorizeVote: act.onAuthorizeVote,
      onRevokeVote: act.onRevokeVote,
      onSetProposalStatus: act.onSetProposalStatusV2
    }
  );

  const { currentUser } = useLoaderContext();

  const onAbandonProposal = proposal => reason =>
    onSetProposalStatus(
      proposal.censorshiprecord.token,
      PROPOSAL_STATUS_ABANDONED,
      reason
    );

  const onAuthorizeVote = proposal => () =>
    onAuthorize(
      currentUser.email,
      proposal.censorshiprecord.token,
      proposal.version
    );

  const onRevokeVote = proposal => () =>
    onRevoke(
      currentUser.email,
      proposal.censorshiprecord.token,
      proposal.version
    );

  const onStartVote = proposal => ({
    duration,
    quorumPercentage,
    passPercentage
  }) =>
    onStart(
      currentUser.email,
      proposal.censorshiprecord.token,
      duration,
      quorumPercentage,
      passPercentage
    );

  return {
    onAbandonProposal,
    onAuthorizeVote,
    onRevokeVote,
    onStartVote
  };
}
