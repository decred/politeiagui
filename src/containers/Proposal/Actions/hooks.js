import { createContext, useContext, useCallback } from "react";
import {
  PROPOSAL_STATUS_CENSORED,
  PROPOSAL_STATUS_PUBLIC,
  PROPOSAL_STATUS_ARCHIVED
} from "src/constants";
import * as sel from "src/selectors";
import * as act from "src/actions";
import { useAction, useSelector } from "src/redux";
import { fullVoteParamObject } from "./helpers";

export const PublicProposalsActionsContext = createContext();
export const UnvettedProposalsActionsContext = createContext();

export const usePublicProposalActions = () =>
  useContext(PublicProposalsActionsContext);
export const useUnvettedProposalActions = () =>
  useContext(UnvettedProposalsActionsContext);

export function useUnvettedActions() {
  const onSetProposalStatus = useAction(act.onSetProposalStatus);

  const onCensorProposal = useCallback(
    ({ censorshiprecord: { token }, version, state, status }) =>
      (reason) =>
        onSetProposalStatus({
          token,
          status: PROPOSAL_STATUS_CENSORED,
          oldStatus: status,
          reason,
          version,
          state
        }),
    [onSetProposalStatus]
  );

  const onApproveProposal = useCallback(
    ({ censorshiprecord: { token }, version, linkto, state, status }) =>
      () =>
        onSetProposalStatus({
          token,
          status: PROPOSAL_STATUS_PUBLIC,
          oldStatus: status,
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
  const onAuthorize = useAction(act.onAuthorizeVote);
  const onRevoke = useAction(act.onRevokeVote);
  const onSetBillingStatusAction = useAction(act.onSetBillingStatus);
  const onFetchProposalsBatchWithoutState = useAction(
    act.onFetchProposalsBatchWithoutState
  );

  const currentUserID = useSelector(sel.currentUserID);

  const onCensorProposal = useCallback(
    ({ censorshiprecord: { token }, version, state, status }) =>
      (reason) =>
        onSetProposalStatus({
          token,
          status: PROPOSAL_STATUS_CENSORED,
          oldStatus: status,
          reason,
          version,
          state
        }),
    [onSetProposalStatus]
  );

  const onAbandonProposal = useCallback(
    ({ censorshiprecord: { token }, version, state, status }) =>
      (reason) =>
        onSetProposalStatus({
          token,
          status: PROPOSAL_STATUS_ARCHIVED,
          oldStatus: status,
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

  // votes param is an array of object : [{ token, version, parent }] - where
  // parent is RFP propsoals in case of runoff vote
  const onStartVote = useCallback(
    (votes, type, cb) =>
      async ({ duration, quorumPercentage, passPercentage }) => {
        await onStart(
          currentUserID,
          votes.map(({ token, version, parent }) =>
            fullVoteParamObject({
              type,
              version,
              duration,
              quorumpercentage: quorumPercentage,
              passpercentage: passPercentage,
              token,
              parent
            })
          )
        );
        cb && cb();
      },
    [onStart, currentUserID]
  );

  const onSetBillingStatus = useCallback(
    (proposal) =>
      ({ billingStatus, reason }) =>
        onSetBillingStatusAction(
          proposal.censorshiprecord.token,
          billingStatus,
          reason
        ),
    [onSetBillingStatusAction]
  );

  return {
    onCensorProposal,
    onAbandonProposal,
    onAuthorizeVote,
    onRevokeVote,
    onStartVote,
    onSetBillingStatus,
    onFetchProposalsBatchWithoutState
  };
}
