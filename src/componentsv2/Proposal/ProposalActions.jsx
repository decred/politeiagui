import React from "react";
import { Button } from "pi-ui";
import {
  isPublicProposal,
  isUnreviewedProposal,
  isAbandonedProposal,
  isVotingNotAuthorizedProposal,
  isUnderDiscussionProposal
} from "src/containers/Proposal/helpers";
import {
  useUnvettedProposalActions,
  usePublicProposalActions
} from "src/containers/Proposal/Actions";
import AdminContent from "src/componentsv2/AdminContent";
import { useLoaderContext } from "src/Appv2/Loader";

const UnvettedActions = ({ proposal }) => {
  if (!useUnvettedProposalActions()) {
    throw Error(
      "UnvettedActions requires an UnvettedActionsProvider on a higher level of the component tree. "
    );
  }

  const { onCensor, onApprove } = useUnvettedProposalActions();

  const withProposal = fn => () => {
    fn(proposal);
  };

  return (
    isUnreviewedProposal(proposal) && (
      <AdminContent>
        <div className="justify-right margin-top-m">
          <Button
            onClick={withProposal(onCensor)}
            className="margin-right-s"
            kind="secondary"
          >
            Report as spam
          </Button>
          <Button onClick={withProposal(onApprove)}>Approve</Button>
        </div>
      </AdminContent>
    )
  );
};

const PublicActions = ({ proposal, voteStatus }) => {
  if (!usePublicProposalActions()) {
    throw Error(
      "PublicActions requires an PublicActionsProvider on a higher level of the component tree. "
    );
  }

  const { currentUser } = useLoaderContext();

  const {
    onAuthorizeVote,
    onRevokeVote,
    onAbandon,
    onStartVote
  } = usePublicProposalActions();

  const withProposal = fn => () => {
    fn(proposal);
  };

  const isProposalOwner =
    currentUser && proposal && currentUser.userid === proposal.userid;

  const isVotingStartAuthorized = !isVotingNotAuthorizedProposal(voteStatus);
  return (
    isUnderDiscussionProposal(proposal, voteStatus) && (
      <div className="justify-right margin-top-m">
        {isProposalOwner &&
          (!isVotingStartAuthorized ? (
            <Button onClick={withProposal(onAuthorizeVote)}>
              Authorize voting to start
            </Button>
          ) : (
            <Button onClick={withProposal(onRevokeVote)}>
              Revoke voting authorization
            </Button>
          ))}
        <AdminContent>
          {!isVotingStartAuthorized ? (
            <Button onClick={withProposal(onAbandon)}>Abandon</Button>
          ) : (
            <Button onClick={withProposal(onStartVote)}>Start Vote</Button>
          )}
        </AdminContent>
      </div>
    )
  );
};

const ProposalActions = ({ proposal, voteStatus }) => {
  return isPublicProposal(proposal) || isAbandonedProposal(proposal) ? (
    <PublicActions proposal={proposal} voteStatus={voteStatus} />
  ) : (
    <UnvettedActions proposal={proposal} />
  );
};

export default ProposalActions;
