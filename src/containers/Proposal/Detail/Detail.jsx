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
  isActiveProposal
} from "../helpers";
import {
  UnvettedActionsProvider,
  PublicActionsProvider
} from "src/containers/Proposal/Actions";
import { useProposalVote } from "../hooks";
import useDocumentTitle from "src/hooks/utils/useDocumentTitle";
import Link from "src/components/Link";
import { GoBackLink } from "src/components/Router";
import { useConfig } from "src/containers/Config";
import Or from "src/components/Or";
import LoggedInContent from "src/components/LoggedInContent";
import CommentForm from "src/components/CommentForm/CommentFormLazy";
import { IdentityMessageError } from "src/components/IdentityErrorIndicators";
import WhatAreYourThoughts from "src/components/WhatAreYourThoughts";
import { PROPOSAL_UPDATE_HINT, PROPOSAL_STATE_UNVETTED } from "src/constants";
import { shortRecordToken } from "src/helpers";
import ModalLogin from "src/components/ModalLogin";
import useModalContext from "src/hooks/utils/useModalContext";
import { usePaywall, useIdentity } from "src/hooks";
import usePolicy from "src/hooks/api/usePolicy";

const COMMENTS_LOGIN_MODAL_ID = "commentsLoginModal";

const SetPageTitle = ({ title }) => {
  useDocumentTitle(title);
  return null;
};

const ProposalDetail = ({ Main, match, history }) => {
  const tokenFromUrl = shortRecordToken(get("params.token", match));
  const threadParentCommentID = get("params.commentid", match);
  const {
    policyTicketVote: { summariespagesize: proposalPageSize }
  } = usePolicy();
  const {
    proposal,
    loading,
    threadParentID,
    error,
    isCurrentUserProposalAuthor,
    commentSectionIds,
    hasAuthorUpdates,
    singleThreadRootId,
    onSubmitComment,
    currentUser,
    commentsError,
    commentsLoading,
    onReloadProposalDetails
  } = useProposal(tokenFromUrl, proposalPageSize, threadParentCommentID);
  const { userid } = currentUser || {};
  const isSingleThread = !!threadParentID;
  const proposalToken = getProposalToken(proposal);
  const proposalState = proposal?.state;
  const { voteSummary, proposalSummary } = useProposalVote(
    proposalToken || tokenFromUrl
  );
  const areCommentsAllowed =
    !isVotingFinishedProposal(voteSummary) &&
    !isAbandonedProposal(proposalSummary);
  const areAuthorUpdatesAllowed = isActiveProposal(proposalSummary);
  const isUnvetted = proposalState === PROPOSAL_STATE_UNVETTED;
  const readOnly = !areCommentsAllowed && !areAuthorUpdatesAllowed;
  const readOnlyReason = getCommentBlockedReason(proposalSummary);
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
      onLoggedIn: () => {
        if (isUnvetted) {
          onReloadProposalDetails();
        }
        handleCloseModal();
      }
    });
  }, [handleOpenModal, handleCloseModal, isUnvetted, onReloadProposalDetails]);

  const CommentsSection = React.memo(({ sectionId }) => (
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
      sectionId={sectionId}
    />
  ));

  const canSubmitComments =
    !isSingleThread &&
    !readOnly &&
    (!areAuthorUpdatesAllowed ||
      (areAuthorUpdatesAllowed && isCurrentUserProposalAuthor)) &&
    !!proposalToken;

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
              {canSubmitComments && (
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
          </Card>
        )}
        {commentsError && (
          <Message kind="error" className="margin-top-m">
            {commentsError.toString()}
          </Message>
        )}
        {singleThreadRootId ? (
          <CommentsSection sectionId={singleThreadRootId} />
        ) : (
          <>
            {commentSectionIds?.map((sectionId) => (
              <CommentsSection key={sectionId} sectionId={sectionId} />
            ))}
          </>
        )}
      </>
    ),
    [
      commentSectionIds,
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
      readOnly,
      readOnlyReason,
      tokenFromUrl,
      userid,
      commentsError,
      hasAuthorUpdates,
      canSubmitComments
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
            ) : loading || !proposal ? (
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
