import React, { useState, useCallback, useMemo } from "react";
import styles from "./Comment.module.css";
import CommentForm from "src/components/CommentForm/CommentFormLazy";
import Link from "src/components/Link";
import { useComment } from "../hooks";
import { isInCommentTree } from "../helpers";
import Comment from "./Comment";
import {
  PROPOSAL_STATE_UNVETTED,
  PROPOSAL_COMMENT_UPVOTE,
  PROPOSAL_COMMENT_DOWNVOTE,
  PROPOSAL_UPDATE_HINT
} from "src/constants";

const ContextLink = React.memo(({ parentid, recordToken }) => (
  <Link
    className={styles.contextLink}
    to={`/record/${recordToken}/comments/${parentid}`}>
    see in context
  </Link>
));

const Replies = React.memo(({ children }) => (
  <div className={styles.childrenContainer}>{children}</div>
));

const CommentContent = React.memo(
  ({
    showReplyForm,
    commentid,
    token,
    handleSubmitComment,
    handleToggleReplyForm,
    handleCommentSubmitted,
    isThread,
    children
  }) => {
    const commentForm = useMemo(
      () => (
        <CommentForm
          className={styles.replyForm}
          persistKey={`replying-to-${commentid}-from-${token}`}
          onSubmit={handleSubmitComment}
          onCancel={handleToggleReplyForm}
          onCommentSubmitted={handleCommentSubmitted}
        />
      ),
      [
        commentid,
        handleSubmitComment,
        token,
        handleCommentSubmitted,
        handleToggleReplyForm
      ]
    );

    return (
      <>
        {showReplyForm && commentForm}
        {isThread && children}
      </>
    );
  }
);

const CommentWrapper = ({
  comment,
  children,
  numOfReplies,
  isFlatMode,
  proposalState,
  recordBaseLink,
  ...props
}) => {
  const {
    onSubmitComment,
    onCommentVote,
    getCommentLikeOption,
    enableCommentVote,
    recordAuthorID,
    recordAuthorUsername,
    loadingLikes,
    userLoggedIn,
    recordToken,
    readOnly,
    identityError,
    paywallMissing,
    openCensorModal,
    openLoginModal,
    isAdmin,
    currentUser,
    getCommentVotes,
    latestAuthorUpdateId,
    areAuthorUpdatesAllowed,
    comments
  } = useComment();
  const {
    comment: commentText,
    token,
    commentid,
    deleted: censored,
    timestamp,
    username,
    userid,
    isNew,
    sumOfNewDescendants,
    parentid,
    extradatahint,
    extradata
  } = comment;

  const isAuthorUpdate = extradatahint === PROPOSAL_UPDATE_HINT;
  const authorUpdateMetadata = isAuthorUpdate && JSON.parse(extradata);
  const isInLatestUpdateCommentTree =
    comments && isInCommentTree(latestAuthorUpdateId, commentid, comments);
  const isRecordAuthor =
    recordAuthorID === userid || recordAuthorUsername === username;
  const censorable = isAdmin && !readOnly;

  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showReplies, setShowReplies] = useState(true);
  // get comment's votes from cache. If they don't exist, get it from comment
  const { upvotes, downvotes } = useMemo(
    () => getCommentVotes(comment.commentid) || comment,
    [getCommentVotes, comment]
  );

  const hasChildrenComments = useMemo(
    () =>
      !!React.Children.toArray(children).filter(
        (child) =>
          child.props && child.props.comments && !!child.props.comments.length
      ).length,
    [children]
  );
  const isThread = showReplies && hasChildrenComments && !isFlatMode;
  const isFlatReply = isFlatMode && parentid > 0;

  const handleToggleReplyForm = useCallback(() => {
    setShowReplyForm(!showReplyForm);
  }, [showReplyForm]);

  const handleToggleReplies = useCallback(() => {
    setShowReplies(!showReplies);
  }, [showReplies]);

  const handleSubmitComment = useCallback(
    ({ comment }) =>
      onSubmitComment({
        comment,
        token,
        parentID: commentid,
        state: proposalState
      }),
    [onSubmitComment, token, commentid, proposalState]
  );

  const handleCommentSubmitted = useCallback(() => {
    setShowReplyForm(false);
    setShowReplies(true);
  }, []);

  const handleLikeComment = useCallback(() => {
    if (!userLoggedIn) {
      openLoginModal();
      return;
    }
    return onCommentVote(commentid, PROPOSAL_COMMENT_UPVOTE);
  }, [openLoginModal, userLoggedIn, onCommentVote, commentid]);

  const handleDislikeComment = useCallback(() => {
    if (!userLoggedIn) {
      openLoginModal();
      return;
    }
    return onCommentVote(commentid, PROPOSAL_COMMENT_DOWNVOTE);
  }, [openLoginModal, onCommentVote, userLoggedIn, commentid]);

  const handleClickCensor = useCallback(() => {
    return openCensorModal(commentid);
  }, [commentid, openCensorModal]);

  const contextLink = isFlatReply && (
    <ContextLink parentid={parentid} recordToken={recordToken} />
  );

  const isLikeCommentDisabled =
    loadingLikes ||
    readOnly ||
    (userLoggedIn &&
      (identityError || paywallMissing || currentUser.username === username)) ||
    (areAuthorUpdatesAllowed && !isInLatestUpdateCommentTree);

  return (
    <>
      <Comment
        permalink={`${recordBaseLink}/comments/${commentid}`}
        seeInContextLink={contextLink}
        censorable={censorable}
        author={username}
        authorID={userid}
        createdAt={timestamp}
        censored={censored}
        highlightAuthor={isRecordAuthor}
        highlightAsNew={isNew}
        disableLikes={
          !enableCommentVote || proposalState === PROPOSAL_STATE_UNVETTED
        }
        disableLikesClick={isLikeCommentDisabled}
        disableReply={
          readOnly ||
          !!identityError ||
          paywallMissing ||
          (areAuthorUpdatesAllowed && !isInLatestUpdateCommentTree)
        }
        likesUpCount={upvotes}
        likesDownCount={downvotes}
        likeOption={getCommentLikeOption(commentid)}
        onLike={handleLikeComment}
        onDislike={handleDislikeComment}
        showReplies={showReplies}
        isFlatMode={isFlatMode}
        onClickCensor={handleClickCensor}
        onClickReply={handleToggleReplyForm}
        onClickShowReplies={handleToggleReplies}
        numOfReplies={numOfReplies}
        numOfNewHiddenReplies={sumOfNewDescendants}
        commentBody={commentText}
        isAuthorUpdate={isAuthorUpdate}
        authorUpdateTitle={authorUpdateMetadata && authorUpdateMetadata.title}
        {...props}
      />
      <CommentContent
        showReplyForm={showReplyForm}
        commentid={commentid}
        token={token}
        handleSubmitComment={handleSubmitComment}
        handleToggleReplyForm={handleToggleReplyForm}
        handleCommentSubmitted={handleCommentSubmitted}
        isThread={isThread}>
        <Replies>{children}</Replies>
      </CommentContent>
    </>
  );
};

export default CommentWrapper;
