import React, { useMemo } from "react";
import { Message } from "pi-ui";
import get from "lodash/fp/get";
import { withRouter } from "react-router-dom";
import Proposal from "src/components/Proposal";
import styles from "./Detail.module.css";
import { useProposal, useComments } from "./hooks";
import Comments from "src/containers/Comments";
import ProposalLoader from "src/components/Proposal/ProposalLoader";
import { getCommentBlockedReason } from "./helpers";
import {
  isVotingFinishedProposal,
  getProposalToken,
  isCensoredProposal,
  isAbandonedProposal,
  getProposalLink,
  isApprovedProposal
} from "../helpers";
import {
  UnvettedActionsProvider,
  PublicActionsProvider
} from "src/containers/Proposal/Actions";
import { useProposalVote } from "../hooks";
import useDocumentTitle from "src/hooks/utils/useDocumentTitle";
import useProposalsStatusChangeUser from "src/hooks/api/useProposalsStatusChangeUser";
import { GoBackLink } from "src/components/Router";
import { useConfig } from "src/containers/Config";
import {
  PROPOSAL_STATUS_CENSORED,
  PROPOSAL_MAIN_THREAD_KEY
} from "src/constants";
import { shortRecordToken } from "src/helpers";

const SetPageTitle = ({ title }) => {
  useDocumentTitle(title);
  return null;
};

const ProposalDetail = ({ Main, match }) => {
  const tokenFromUrl = shortRecordToken(get("params.token", match));
  const threadParentCommentID = get("params.commentid", match);
  const {
    proposal: fetchedProposal,
    loading,
    threadParentID,
    error,
    isCurrentUserProposalAuthor
  } = useProposal(tokenFromUrl, threadParentCommentID);
  const { proposals, loading: mdLoading } = useProposalsStatusChangeUser(
    { [tokenFromUrl]: fetchedProposal },
    PROPOSAL_STATUS_CENSORED
  );
  const proposal = proposals[tokenFromUrl];
  const proposalToken = getProposalToken(proposal);
  const { voteSummary } = useProposalVote(proposalToken || tokenFromUrl);
  const areCommentsAllowed =
    !isVotingFinishedProposal(voteSummary) && !isAbandonedProposal(proposal);
  // XXX this should be to false when the proposal billing status is set
  // to closed or completed.
  // Currently this piece of info isn't available and need to be returned
  // from the BE somehow.
  const areAuthorUpdatesAllowed = isApprovedProposal(proposal, voteSummary);
  const { javascriptEnabled } = useConfig();

  const {
    onSubmitComment,
    onCommentVote,
    onCensorComment,
    // If comments includes author updates comments will be a map-like object
    // where the keys are the author update ids mapping to an array with the
    // update's thread comments. The map has an additional special key
    // PROPOSAL_MAIN_THREAD_KEY which maps to the main comments thread.
    comments,
    loading: commentsLoading,
    recordType,
    lastVisitTimestamp,
    currentUser,
    error: commentsError,
    getCommentLikeOption,
    enableCommentVote,
    userLoggedIn,
    userEmail,
    loadingLikes,
    getCommentVotes,
    latestAuthorUpdateId,
    authorUpdateIds
  } = useComments(proposalToken, proposal?.state);

  const commentsSection = useMemo(() => {
    return (
      <>
        {authorUpdateIds &&
          authorUpdateIds.map((updateId) => (
            <Comments
              recordAuthorID={proposal?.userid}
              recordAuthorUsername={proposal?.username}
              recordToken={tokenFromUrl}
              recordTokenFull={proposalToken}
              numOfComments={comments[updateId].length}
              threadParentID={threadParentID}
              readOnly={!areCommentsAllowed && !areAuthorUpdatesAllowed}
              readOnlyReason={getCommentBlockedReason(proposal, voteSummary)}
              areAuthorUpdatesAllowed={areAuthorUpdatesAllowed}
              isCurrentUserProposalAuthor={isCurrentUserProposalAuthor}
              proposalState={proposal?.state}
              recordBaseLink={getProposalLink(proposal, javascriptEnabled)}
              onSubmitComment={onSubmitComment}
              onCommentVote={onCommentVote}
              onCensorComment={onCensorComment}
              comments={comments[updateId]}
              loading={commentsLoading}
              recordType={recordType}
              lastVisitTimestamp={lastVisitTimestamp}
              currentUser={currentUser}
              error={commentsError}
              latestAuthorUpdateId={latestAuthorUpdateId}
              getCommentLikeOption={getCommentLikeOption}
              enableCommentVote={enableCommentVote}
              userLoggedIn={userLoggedIn}
              userEmail={userEmail}
              loadingLikes={loadingLikes}
              getCommentVotes={getCommentVotes}
            />
          ))}
        <Comments
          recordAuthorID={proposal?.userid}
          recordAuthorUsername={proposal?.username}
          recordToken={tokenFromUrl}
          recordTokenFull={proposalToken}
          numOfComments={proposal?.comments}
          threadParentID={threadParentID}
          readOnly={!areCommentsAllowed && !areAuthorUpdatesAllowed}
          readOnlyReason={getCommentBlockedReason(proposal, voteSummary)}
          areAuthorUpdatesAllowed={areAuthorUpdatesAllowed}
          isCurrentUserProposalAuthor={isCurrentUserProposalAuthor}
          proposalState={proposal?.state}
          recordBaseLink={getProposalLink(proposal, javascriptEnabled)}
          onSubmitComment={onSubmitComment}
          onCommentVote={onCommentVote}
          onCensorComment={onCensorComment}
          comments={comments && comments[PROPOSAL_MAIN_THREAD_KEY]}
          loading={commentsLoading}
          recordType={recordType}
          lastVisitTimestamp={lastVisitTimestamp}
          currentUser={currentUser}
          error={commentsError}
          latestAuthorUpdateId={latestAuthorUpdateId}
          getCommentLikeOption={getCommentLikeOption}
          enableCommentVote={enableCommentVote}
          userLoggedIn={userLoggedIn}
          userEmail={userEmail}
          loadingLikes={loadingLikes}
          getCommentVotes={getCommentVotes}
        />
      </>
    );
  }, [
    areAuthorUpdatesAllowed,
    areCommentsAllowed,
    authorUpdateIds,
    comments,
    commentsError,
    commentsLoading,
    currentUser,
    enableCommentVote,
    getCommentLikeOption,
    getCommentVotes,
    isCurrentUserProposalAuthor,
    javascriptEnabled,
    lastVisitTimestamp,
    latestAuthorUpdateId,
    loadingLikes,
    onCensorComment,
    onCommentVote,
    onSubmitComment,
    proposal,
    proposalToken,
    recordType,
    threadParentID,
    tokenFromUrl,
    userEmail,
    userLoggedIn,
    voteSummary
  ]);

  return (
    <>
      <Main className={styles.customMain} fillScreen>
        <GoBackLink />
        {proposal && <SetPageTitle title={proposal.name} />}
        <UnvettedActionsProvider>
          <PublicActionsProvider>
            {error ? (
              <Message kind="error">{error.toString()}</Message>
            ) : loading || mdLoading || !proposal ? (
              <ProposalLoader extended />
            ) : (
              <Proposal
                proposal={proposal}
                extended
                collapseBodyContent={!!threadParentID}
              />
            )}
            {!isCensoredProposal(proposal) && commentsSection}
          </PublicActionsProvider>
        </UnvettedActionsProvider>
      </Main>
    </>
  );
};

export default withRouter(ProposalDetail);
