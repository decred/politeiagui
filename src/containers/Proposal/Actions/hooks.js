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
  const onSetProposalStatus = useAction(act.onSetProposalStatus);

  const onCensorProposal = useCallback(
    ({ censorshiprecord: { token }, version, state }) => (reason) =>
      onSetProposalStatus({
        token,
        status: PROPOSAL_STATUS_CENSORED,
        reason,
        version,
        state
      }),
    [onSetProposalStatus]
  );

  const onApproveProposal = useCallback(
    ({ censorshiprecord: { token }, version, state, linkto }) => () =>
      onSetProposalStatus({
        token,
        status: PROPOSAL_STATUS_PUBLIC,
        linkto,
        version,
        state
      }),
    [onSetProposalStatus]
  );

  return {
    onCensorProposal,
    onApproveProposal
  };
}

export function usePublicActions() {
  const onSetProposalStatus = useAction(act.onSetProposalStatus);
  const onStart = useAction(act.onStartVote);
  const onStartRunoff = useAction(act.onStartRunoffVote);
  const onAuthorize = useAction(act.onAuthorizeVote);
  const onRevoke = useAction(act.onRevokeVote);
  const onFetchProposalsBatchWithoutState = useAction(
    act.onFetchProposalsBatchWithoutState
  );

  const currentUserID = useSelector(sel.currentUserID);

  const onAbandonProposal = useCallback(
    ({ censorshiprecord: { token }, version, state }) => (reason) =>
      onSetProposalStatus({
        token,
        status: PROPOSAL_STATUS_ABANDONED,
        reason,
        version,
        state
      }),
    [onSetProposalStatus]
  );

  const onAuthorizeVote = useCallback(
    (proposal) => () =>
      onAuthorize(
        currentUserID,
        proposal.censorshiprecord.token,
        proposal.version
      ),
    [onAuthorize, currentUserID]
  );

  const onRevokeVote = useCallback(
    (proposal) => () =>
      onRevoke(
        currentUserID,
        proposal.censorshiprecord.token,
        proposal.version
      ),
    [onRevoke, currentUserID]
  );

  const onStartVote = useCallback(
    ({ censorshiprecord: { token } = { token: null }, version }) => ({
      duration,
      quorumPercentage,
      passPercentage
    }) =>
      onStart(
        currentUserID,
        token,
        duration,
        quorumPercentage,
        passPercentage,
        version
      ),
    [onStart, currentUserID]
  );

  const onStartRunoffVote = useCallback(
    (token, votes, cb) => async ({
      duration,
      quorumPercentage,
      passPercentage
    }) => {
      await onStartRunoff(
        currentUserID,
        token,
        duration,
        quorumPercentage,
        passPercentage,
        votes
      );
      cb && cb();
    },
    [onStartRunoff, currentUserID]
  );

  return {
    onAbandonProposal,
    onAuthorizeVote,
    onRevokeVote,
    onStartVote,
    onStartRunoffVote,
    onFetchProposalsBatchWithoutState
  };
}
