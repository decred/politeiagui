import React from "react";
import { Button, classNames } from "pi-ui";
import {
  isUnreviewedProposal,
  isVotingNotAuthorizedProposal,
  isUnderDiscussionProposal,
  isRfpReadyToRunoff,
  isApprovedProposal,
  isClosedProposal,
  isCompletedProposal
} from "src/containers/Proposal/helpers";
import {
  useUnvettedProposalActions,
  usePublicProposalActions
} from "src/containers/Proposal/Actions";
import AdminContent from "src/components/AdminContent";
import { useLoaderContext } from "src/containers/Loader";
import styles from "./ProposalActions.module.css";
import { PROPOSAL_STATE_UNVETTED } from "../../constants";

const UnvettedActions = ({ proposal }) => {
  if (!useUnvettedProposalActions()) {
    throw Error(
      "UnvettedActions requires an UnvettedActionsProvider on a higher level of the component tree. "
    );
  }

  const { onCensor, onApprove } = useUnvettedProposalActions();

  const withProposal = (fn) => () => {
    fn(proposal);
  };

  return (
    isUnreviewedProposal(proposal) && (
      <AdminContent>
        <div className="justify-right margin-top-m">
          <Button
            onClick={withProposal(onCensor)}
            className={classNames("margin-right-s", styles.reportButton)}
            noBorder
            kind="secondary">
            Report as spam
          </Button>
          <Button onClick={withProposal(onApprove)}>Approve</Button>
        </div>
      </AdminContent>
    )
  );
};

const PublicActions = ({
  proposal,
  voteSummary,
  proposalSummary,
  rfpSubmissionsVoteSummaries,
  resetRfpSubmissionsData,
  isLegacy
}) => {
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
    onStartVote,
    onStartRunoffVote,
    onCensor,
    onSetBillingStatus
  } = usePublicProposalActions();
  const isProposalOwner =
    currentUser && proposal && currentUser.username === proposal.username;
  const isRfpSubmission = !!proposal.linkto;
  const isVotingStartAuthorized = !isVotingNotAuthorizedProposal(voteSummary);
  const isReadyToRunoff = isRfpReadyToRunoff(
    proposal,
    voteSummary,
    rfpSubmissionsVoteSummaries
  );
  const isUnderDiscussion = isUnderDiscussionProposal(proposal, voteSummary);
  const isApproved = isApprovedProposal(proposal, voteSummary);
  const isClosed = isClosedProposal(proposalSummary);
  const isCompleted = isCompletedProposal(proposalSummary);
  const isSetBillingStatusAllowed =
    isApproved && !isLegacy && !isClosed && !isCompleted;

  const withProposal = (fn, cb) => () => {
    fn(proposal, cb);
  };

  return (
    <>
      {isUnderDiscussion && !isLegacy && (
        <div className="justify-right margin-top-m">
          <AdminContent>
            <Button
              onClick={withProposal(onCensor)}
              className={classNames("margin-right-s", styles.reportButton)}
              noBorder
              kind="secondary">
              Report as spam
            </Button>
          </AdminContent>
          {isProposalOwner &&
            !isRfpSubmission &&
            (!isVotingStartAuthorized ? (
              <Button onClick={withProposal(onAuthorizeVote)}>
                Authorize voting
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
      )}
      {isSetBillingStatusAllowed && (
        <AdminContent>
          <div className="justify-right margin-top-m">
            <Button onClick={withProposal(onSetBillingStatus)}>
              Set Billing Status
            </Button>
          </div>
        </AdminContent>
      )}
      {isReadyToRunoff && (
        <AdminContent>
          <div className="justify-right margin-top-m">
            <Button
              onClick={withProposal(
                onStartRunoffVote,
                resetRfpSubmissionsData
              )}>
              Start Runoff Vote
            </Button>
          </div>
        </AdminContent>
      )}
    </>
  );
};

const ProposalActions = ({ proposal, ...props }) => {
  return proposal.state === PROPOSAL_STATE_UNVETTED ? (
    <UnvettedActions proposal={proposal} />
  ) : (
    <PublicActions {...{ ...props, proposal }} />
  );
};

export default ProposalActions;
