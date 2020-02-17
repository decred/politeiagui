import { createContext, useContext, useCallback } from "react";
import {
  PROPOSAL_STATUS_CENSORED,
  PROPOSAL_STATUS_PUBLIC,
  PROPOSAL_STATUS_ABANDONED
} from "src/constants";
import * as sel from "src/selectors";
import * as act from "src/actions";
import { useAction, useSelector } from "src/redux";

export const PublicProposalsActionsContext = createContext();
export const UnvettedProposalsActionsContext = createContext();

export const usePublicProposalActions = () =>
  useContext(PublicProposalsActionsContext);
export const useUnvettedProposalActions = () =>
  useContext(UnvettedProposalsActionsContext);

export function useUnvettedActions() {
  const onSetProposalStatus = useAction(act.onSetProposalStatusV2);

  const onCensorProposal = useCallback(
    (proposal) => (reason) =>
      onSetProposalStatus(
        proposal.censorshiprecord.token,
        PROPOSAL_STATUS_CENSORED,
        reason
      ),
    [onSetProposalStatus]
  );

  const onApproveProposal = useCallback(
    (proposal) => () =>
      onSetProposalStatus(
        proposal.censorshiprecord.token,
        PROPOSAL_STATUS_PUBLIC
      ),
    [onSetProposalStatus]
  );

  return {
    onCensorProposal,
    onApproveProposal
  };
}

export function usePublicActions() {
  const onSetProposalStatus = useAction(act.onSetProposalStatusV2);
  const onStart = useAction(act.onStartVote);
  const onAuthorize = useAction(act.onAuthorizeVote);
  const onRevoke = useAction(act.onRevokeVote);

  const currentUserEmail = useSelector(sel.currentUserEmail);

  const onAbandonProposal = useCallback(
    (proposal) => (reason) =>
      onSetProposalStatus(
        proposal.censorshiprecord.token,
        PROPOSAL_STATUS_ABANDONED,
        reason
      ),
    [onSetProposalStatus]
  );

  const onAuthorizeVote = useCallback(
    (proposal) => () =>
      onAuthorize(
        currentUserEmail,
        proposal.censorshiprecord.token,
        proposal.version
      ),
    [onAuthorize, currentUserEmail]
  );

  const onRevokeVote = useCallback(
    (proposal) => () =>
      onRevoke(
        currentUserEmail,
        proposal.censorshiprecord.token,
        proposal.version
      ),
    [onRevoke, currentUserEmail]
  );

  const onStartVote = useCallback(
    ({ censorshiprecord: { token }, version }) => ({
      duration,
      quorumPercentage,
      passPercentage
    }) =>
      onStart(
        currentUserEmail,
        token,
        duration,
        quorumPercentage,
        passPercentage,
        version
      ),
    [onStart, currentUserEmail]
  );

  return {
    onAbandonProposal,
    onAuthorizeVote,
    onRevokeVote,
    onStartVote
  };
}
