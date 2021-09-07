import React, { useMemo, useCallback } from "react";
import { Card, Message, P, classNames } from "pi-ui";
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
import Link from "src/components/Link";
import { GoBackLink } from "src/components/Router";
import { useConfig } from "src/containers/Config";
import Or from "src/components/Or";
import LoggedInContent from "src/components/LoggedInContent";
import CommentForm from "src/components/CommentForm/CommentFormLazy";
import { IdentityMessageError } from "src/components/IdentityErrorIndicators";
import WhatAreYourThoughts from "src/components/WhatAreYourThoughts";
import {
  PROPOSAL_STATUS_CENSORED,
  PROPOSAL_MAIN_THREAD_KEY,
  PROPOSAL_UPDATE_HINT
} from "src/constants";
import { shortRecordToken } from "src/helpers";
import ModalLogin from "src/components/ModalLogin";
import useModalContext from "src/hooks/utils/useModalContext";
import { usePaywall, useIdentity } from "src/hooks";

const COMMENTS_LOGIN_MODAL_ID = "commentsLoginModal";

const SetPageTitle = ({ title }) => {
  useDocumentTitle(title);
  return null;
};

const ProposalDetail = ({ Main, match, history }) => {
  const tokenFromUrl = shortRecordToken(get("params.token", match));
  const threadParentCommentID = get("params.commentid", match);
  const {
    proposal: fetchedProposal,
    loading,
    threadParentID,
    error,
    isCurrentUserProposalAuthor
  } = useProposal(tokenFromUrl, threadParentCommentID);
  const isSingleThread = !!threadParentID;
  const { proposals, loading: mdLoading } = useProposalsStatusChangeUser(
    { [tokenFromUrl]: fetchedProposal },
    PROPOSAL_STATUS_CENSORED
  );
  const proposal = proposals[tokenFromUrl];
  const proposalToken = getProposalToken(proposal);
  const proposalState = proposal?.state;
  const { voteSummary } = useProposalVote(proposalToken || tokenFromUrl);
  const areCommentsAllowed =
    !isVotingFinishedProposal(voteSummary) && !isAbandonedProposal(proposal);
  // XXX this should be to false when the proposal billing status is set
  // to closed or completed.
  // Currently this piece of info isn't available and need to be returned
  // from the BE somehow.
  const areAuthorUpdatesAllowed = isApprovedProposal(proposal, voteSummary);
  const readOnly = !areCommentsAllowed && !areAuthorUpdatesAllowed;
  const readOnlyReason = getCommentBlockedReason(proposal, voteSummary);
  const { javascriptEnabled } = useConfig();
  const { isPaid, paywallEnabled } = usePaywall();
  const paywallMissing = paywallEnabled && !isPaid;
  const {
    onSubmitComment,
    onCommentVote,
    onCensorComment,
    // map-like object where the keys are the author update
    // ids mapping to an array with the update's thread comments. The map has
    // an additional special key PROPOSAL_MAIN_THREAD_KEY which maps to the
    // main comments thread.
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
    authorUpdateIds,
    hasAuthorUpdates
  } = useComments(proposalToken, proposalState);
  const { userid } = currentUser || {};
  const [, identityError] = useIdentity();

  // If displaying a single thread while having multiple author updates with
  // different section, find to which tree the sub-tree we are displaying
  // belongs to display only the relevant section.
  const singleThreadRootId = useMemo(() => {
    let authorUpdateId;
    if (isSingleThread && hasAuthorUpdates) {
      authorUpdateIds.forEach((updateId) => {
        if (
          comments[updateId]
            .map(({ commentid }) => commentid)
            .includes(+threadParentID)
        ) {
          authorUpdateId = updateId;
        }
      });
    }
    return authorUpdateId;
  }, [
    hasAuthorUpdates,
    authorUpdateIds,
    comments,
    isSingleThread,
    threadParentID
  ]);

  const onRedirectToSignup = useCallback(
    () => history.push("/user/signup"),
    [history]
  );

  const handleSubmitComment = useCallback(
    ({ comment, title }) => {
      // If title is provided then we are dealing with an author
      // update.
      let extraData = "",
        extraDataHint = "";
      if (title) {
        extraDataHint = PROPOSAL_UPDATE_HINT;
        extraData = JSON.stringify({ title });
      }
      return onSubmitComment({
        comment,
        token: proposalToken,
        parentID: 0,
        state: proposalState,
        extraData,
        extraDataHint
      });
    },
    [onSubmitComment, proposalState, proposalToken]
  );

  const [handleOpenModal, handleCloseModal] = useModalContext();
  const handleOpenLoginModal = useCallback(() => {
    handleOpenModal(ModalLogin, {
      id: COMMENTS_LOGIN_MODAL_ID,
      onLoggedIn: handleCloseModal
    });
  }, [handleOpenModal, handleCloseModal]);

  const CommentsSection = ({ comments, numOfComments, authorUpdateTitle }) => (
    <Comments
      recordAuthorID={proposal?.userid}
      recordAuthorUsername={proposal?.username}
      recordToken={tokenFromUrl}
      recordTokenFull={proposalToken}
      numOfComments={numOfComments}
      threadParentID={threadParentID}
      readOnly={readOnly}
      areAuthorUpdatesAllowed={areAuthorUpdatesAllowed}
      proposalState={proposalState}
      recordBaseLink={getProposalLink(proposal, javascriptEnabled)}
      onSubmitComment={onSubmitComment}
      onCommentVote={onCommentVote}
      onCensorComment={onCensorComment}
      comments={comments}
      loading={commentsLoading}
      recordType={recordType}
      lastVisitTimestamp={lastVisitTimestamp}
      currentUser={currentUser}
      userid={userid}
      latestAuthorUpdateId={latestAuthorUpdateId}
      getCommentLikeOption={getCommentLikeOption}
      enableCommentVote={enableCommentVote}
      userLoggedIn={userLoggedIn}
      userEmail={userEmail}
      loadingLikes={loadingLikes}
      getCommentVotes={getCommentVotes}
      handleOpenModal={handleOpenModal}
      handleCloseModal={handleCloseModal}
      handleOpenLoginModal={handleOpenLoginModal}
      paywallMissing={paywallMissing}
      identityError={identityError}
      isSingleThread={isSingleThread}
      authorUpdateTitle={authorUpdateTitle}
    />
  );

  const authorUpdateTitle = useCallback(
    (updateId) => {
      const { extradata } = comments[updateId].find(
        ({ commentid }) => commentid === updateId
      );
      const authorUpdateMetadata = JSON.parse(extradata);
      return authorUpdateMetadata.title;
    },
    [comments]
  );

  const proposalComments = useMemo(
    () => (
      <>
        {!commentsLoading && !(currentUser && isSingleThread) && (
          <Card
            className={classNames("container", styles.commentsHeaderWrapper)}>
            <LoggedInContent
              fallback={
                <WhatAreYourThoughts
                  onLoginClick={handleOpenLoginModal}
                  onSignupClick={onRedirectToSignup}
                />
              }>
              <Or>
                {readOnly && (
                  <Message kind="blocked" title="Comments are not allowed">
                    {readOnlyReason}
                  </Message>
                )}
                {!isPaid && paywallEnabled && currentUser && (
                  <Message kind="error">
                    <P>
                      You won't be able to submit comments or proposals before
                      paying the paywall, please visit your{" "}
                      <Link to={`/user/${userid}?tab=credits`}>account</Link>{" "}
                      page to correct this problem.
                    </P>
                  </Message>
                )}
                {!readOnly && !!identityError && <IdentityMessageError />}
                {areAuthorUpdatesAllowed && !isCurrentUserProposalAuthor && (
                  <Message>
                    Replies & upvotes/downvotes are allowed only on the latest
                    author update thread.
                  </Message>
                )}
              </Or>
              {!isSingleThread &&
                ((!readOnly && !areAuthorUpdatesAllowed) ||
                  (!readOnly &&
                    areAuthorUpdatesAllowed &&
                    isCurrentUserProposalAuthor)) &&
                !!proposalToken && (
                  <CommentForm
                    persistKey={`commenting-on-${tokenFromUrl}`}
                    onSubmit={handleSubmitComment}
                    disableSubmit={!!identityError || paywallMissing}
                    isAuthorUpdate={
                      areAuthorUpdatesAllowed && isCurrentUserProposalAuthor
                    }
                  />
                )}
            </LoggedInContent>
            {commentsError && (
              <Message kind="error" className="margin-top-m">
                {commentsError.toString()}
              </Message>
            )}
          </Card>
        )}
        {!commentsLoading &&
          hasAuthorUpdates &&
          (singleThreadRootId ? (
            <CommentsSection
              numOfComments={comments[singleThreadRootId].length}
              comments={comments[singleThreadRootId]}
              authorUpdateTitle={authorUpdateTitle(singleThreadRootId)}
            />
          ) : (
            <>
              {authorUpdateIds.map((updateId) => (
                <CommentsSection
                  key={updateId}
                  numOfComments={comments[updateId].length}
                  comments={comments[updateId]}
                  authorUpdateTitle={authorUpdateTitle(updateId)}
                />
              ))}
              {!!comments[PROPOSAL_MAIN_THREAD_KEY].length && (
                <CommentsSection
                  key={PROPOSAL_MAIN_THREAD_KEY}
                  numOfComments={comments[PROPOSAL_MAIN_THREAD_KEY].length}
                  comments={comments && comments[PROPOSAL_MAIN_THREAD_KEY]}
                />
              )}
            </>
          ))}
        {!commentsLoading &&
          comments &&
          !hasAuthorUpdates &&
          !singleThreadRootId && (
            <CommentsSection
              numOfComments={comments.length}
              comments={comments}
            />
          )}
      </>
    ),
    [
      authorUpdateIds,
      authorUpdateTitle,
      singleThreadRootId,
      comments,
      areAuthorUpdatesAllowed,
      currentUser,
      handleOpenLoginModal,
      handleSubmitComment,
      identityError,
      isCurrentUserProposalAuthor,
      isPaid,
      isSingleThread,
      onRedirectToSignup,
      paywallEnabled,
      paywallMissing,
      proposalToken,
      readOnly,
      readOnlyReason,
      tokenFromUrl,
      userid,
      commentsError,
      commentsLoading,
      hasAuthorUpdates
    ]
  );

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
            {!commentsLoading &&
              comments &&
              !isCensoredProposal(proposal) &&
              proposalComments}
          </PublicActionsProvider>
        </UnvettedActionsProvider>
      </Main>
    </>
  );
};

export default withRouter(ProposalDetail);
