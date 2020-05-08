import React, { useEffect, useState } from "react";
import { Button, classNames } from "pi-ui";
import {
  isPublicProposal,
  isUnreviewedProposal,
  isAbandonedProposal,
  isVotingNotAuthorizedProposal,
  isUnderDiscussionProposal,
  isRfpReadyToRunoff,
  isVoteActiveProposal
} from "src/containers/Proposal/helpers";
import {
  useUnvettedProposalActions,
  usePublicProposalActions
} from "src/containers/Proposal/Actions";
import useProposalBatchWithoutRedux from "src/hooks/api/useProposalBatchWithoutRedux";
import AdminContent from "src/components/AdminContent";
import { useLoaderContext } from "src/containers/Loader";
import styles from "./ProposalActions.module.css";

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

const PublicActions = ({ proposal, voteSummary }) => {
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
    onStartRunoffVote
  } = usePublicProposalActions();

  const withProposal = (fn) => () => {
    fn(proposal);
  };

  const isProposalOwner =
    currentUser && proposal && currentUser.userid === proposal.userid;

  const isRfpSubmission = !!proposal.linkto;

  const isVotingStartAuthorized = !isVotingNotAuthorizedProposal(voteSummary);

  const rfpLinkedSubmissions = proposal.linkedfrom;
  const [hasNoSubmissionUnderVote, setHasNoSubmissionUnderVote] = useState(
    false
  );
  const [, rfpSubmissionsVoteSummaries] = useProposalBatchWithoutRedux(
    rfpLinkedSubmissions ? rfpLinkedSubmissions : null,
    false,
    true
  ) || [[]];
  useEffect(() => {
    // check if RFP submissions are already under vote => hide `start runoff vote` action
    if (rfpSubmissionsVoteSummaries) {
      setHasNoSubmissionUnderVote(
        !isVoteActiveProposal(
          rfpSubmissionsVoteSummaries[rfpLinkedSubmissions[0]]
        )
      );
    }
  }, [
    rfpLinkedSubmissions,
    rfpSubmissionsVoteSummaries,
    setHasNoSubmissionUnderVote,
    hasNoSubmissionUnderVote
  ]);
  return (
    <>
      {isUnderDiscussionProposal(proposal, voteSummary) && (
        <div className="justify-right margin-top-m">
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
      {isRfpReadyToRunoff(proposal, voteSummary) && hasNoSubmissionUnderVote && (
        <div className="justify-right margin-top-m">
          <Button onClick={withProposal(onStartRunoffVote)}>
            Start Runoff Vote
          </Button>
        </div>
      )}
    </>
  );
};

const ProposalActions = ({ proposal, voteSummary }) => {
  return isPublicProposal(proposal) || isAbandonedProposal(proposal) ? (
    <PublicActions proposal={proposal} voteSummary={voteSummary} />
  ) : (
    <UnvettedActions proposal={proposal} />
  );
};

export default ProposalActions;
