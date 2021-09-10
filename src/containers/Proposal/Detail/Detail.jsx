import React, { useMemo, useCallback } from "react";
import { Card, Message, P, classNames } from "pi-ui";
import get from "lodash/fp/get";
import { withRouter } from "react-router-dom";
import Proposal from "src/components/Proposal";
import styles from "./Detail.module.css";
import { useProposal } from "./hooks";
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
    isCurrentUserProposalAuthor,
    authorUpdateIds,
    hasAuthorUpdates,
    singleThreadRootId,
    onSubmitComment,
    currentUser,
    commentsError,
    commentsLoading
  } = useProposal(tokenFromUrl, threadParentCommentID);
  const { userid } = currentUser || {};
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
  const [, identityError] = useIdentity();

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

  const CommentsSection = ({ threadRootId }) => (
    <Comments
      recordAuthorID={proposal?.userid}
      recordAuthorUsername={proposal?.username}
      recordToken={tokenFromUrl}
      recordTokenFull={proposalToken}
      threadParentID={threadParentID}
      readOnly={readOnly}
      areAuthorUpdatesAllowed={areAuthorUpdatesAllowed}
      proposalState={proposalState}
      recordBaseLink={getProposalLink(proposal, javascriptEnabled)}
      handleOpenModal={handleOpenModal}
      handleCloseModal={handleCloseModal}
      handleOpenLoginModal={handleOpenLoginModal}
      paywallMissing={paywallMissing}
      identityError={identityError}
      threadRootId={threadRootId}
    />
  );

  const proposalComments = useMemo(
    () => (
      <>
        {!(currentUser && isSingleThread) && (
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
                    hasAuthorUpdates={hasAuthorUpdates}
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
        {hasAuthorUpdates &&
          (singleThreadRootId ? (
            <CommentsSection threadRootId={singleThreadRootId} />
          ) : (
            <>
              {authorUpdateIds.map((updateId) => (
                <CommentsSection key={updateId} threadRootId={updateId} />
              ))}
              <CommentsSection
                key={PROPOSAL_MAIN_THREAD_KEY}
                threadRootId={PROPOSAL_MAIN_THREAD_KEY}
              />
            </>
          ))}
        {!hasAuthorUpdates && !singleThreadRootId && <CommentsSection />}
      </>
    ),
    [
      authorUpdateIds,
      singleThreadRootId,
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
            {!isCensoredProposal(proposal) &&
              !commentsLoading &&
              proposalComments}
          </PublicActionsProvider>
        </UnvettedActionsProvider>
      </Main>
    </>
  );
};

export default withRouter(ProposalDetail);
