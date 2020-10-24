import React, { useEffect, useState } from "react";
import { Button, classNames } from "pi-ui";
import {
  isPublicProposal,
  isUnreviewedProposal,
  isAbandonedProposal,
  isVotingNotAuthorizedProposal,
  isUnderDiscussionProposal,
  isRfpReadyToRunoff,
  isVoteActiveProposal,
  isVotingFinishedProposal
} from "src/containers/Proposal/helpers";
import {
  useUnvettedProposalActions,
  usePublicProposalActions
} from "src/containers/Proposal/Actions";
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

const PublicActions = ({
  proposal,
  voteSummary,
  rfpSubmissionsVoteSummaries,
  resetRfpSubmissionsData
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
    onCensor
  } = usePublicProposalActions();

  const withProposal = (fn, cb) => () => {
    fn(proposal, cb);
  };

  const isProposalOwner =
    currentUser && proposal && currentUser.userid === proposal.userid;

  const isRfpSubmission = !!proposal.linkto;

  const isVotingStartAuthorized = !isVotingNotAuthorizedProposal(voteSummary);
  const rfpLinkedSubmissions = proposal.linkedfrom;
  const [submissionsDidntVote, setSubmissionsDidntVote] = useState(false);
  useEffect(() => {
    // check if RFP submissions are already under vote => hide `start runoff vote` action
    if (rfpSubmissionsVoteSummaries) {
      setSubmissionsDidntVote(
        !isVoteActiveProposal(
          rfpSubmissionsVoteSummaries[rfpLinkedSubmissions[0]]
        ) &&
          !isVotingFinishedProposal(
            rfpSubmissionsVoteSummaries[rfpLinkedSubmissions[0]]
          )
      );
    } else {
      setSubmissionsDidntVote(false);
    }
  }, [
    rfpLinkedSubmissions,
    rfpSubmissionsVoteSummaries,
    setSubmissionsDidntVote
  ]);

  const underDiscussion = isUnderDiscussionProposal(proposal, voteSummary);
  return (
    <>
      {underDiscussion && (
        <div className="justify-right margin-top-m">
          <Button
            onClick={withProposal(onCensor)}
            className={classNames("margin-right-s", styles.reportButton)}
            noBorder
            kind="secondary">
            Report as spam
          </Button>
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
      {isRfpReadyToRunoff(proposal, voteSummary) && submissionsDidntVote && (
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

const ProposalActions = ({ proposal, ...props }) =>
  isPublicProposal(proposal) || isAbandonedProposal(proposal) ? (
    <PublicActions {...{ ...props, proposal }} />
  ) : (
    <UnvettedActions proposal={proposal} />
  );

export default ProposalActions;
