import React, { useState, useCallback, useMemo } from "react";
import styles from "./Comment.module.css";
import CommentForm from "src/components/CommentForm/CommentFormLazy";
import Link from "src/components/Link";
import { useComment } from "../hooks";
import Comment from "./Comment";
import { handleCommentSubmission } from "../helpers";

const ContextLink = React.memo(({ parentid, recordToken, recordType }) => (
  <Link
    className={styles.contextLink}
    to={`/${recordType}s/${recordToken}/comments/${parentid}`}>
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
  ...props
}) => {
  const {
    onSubmitComment,
    onLikeComment,
    getCommentLikeOption,
    enableCommentVote,
    recordAuthorID,
    loadingLikes,
    loadingLikeAction,
    userLoggedIn,
    recordToken,
    recordType,
    readOnly,
    identityError,
    paywallMissing,
    openCensorModal,
    openLoginModal,
    isAdmin
  } = useComment();
  const {
    comment: commentText,
    token,
    commentid,
    censored,
    timestamp,
    username,
    userid,
    isNew,
    upvotes,
    downvotes,
    sumOfNewDescendants,
    parentid
  } = comment;

  const isRecordAuthor = recordAuthorID === userid;
  const censorable = isAdmin && !readOnly;

  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showReplies, setShowReplies] = useState(true);

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
    handleCommentSubmission(onSubmitComment, token, commentid),
    [onSubmitComment, token, commentid]
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
    return onLikeComment(commentid, "1");
  }, [openLoginModal, userLoggedIn, onLikeComment, commentid]);

  const handleDislikeComment = useCallback(() => {
    if (!userLoggedIn) {
      openLoginModal();
      return;
    }
    return onLikeComment(commentid, "-1");
  }, [openLoginModal, onLikeComment, userLoggedIn, commentid]);

  const handleClickCensor = useCallback(() => {
    return openCensorModal(commentid);
  }, [commentid, openCensorModal]);

  const contextLink = isFlatReply && (
    <ContextLink
      parentid={parentid}
      recordToken={recordToken}
      recordType={recordType}
    />
  );

  return (
    <>
      <Comment
        permalink={`/${recordType}s/${recordToken}/comments/${commentid}`}
        seeInContextLink={contextLink}
        censorable={censorable}
        author={username}
        authorID={userid}
        createdAt={timestamp}
        censored={censored}
        highlightAuthor={isRecordAuthor}
        highlightAsNew={isNew}
        disableLikes={!enableCommentVote}
        disableLikesClick={
          loadingLikes ||
          !!loadingLikeAction ||
          readOnly ||
          (userLoggedIn && (identityError || paywallMissing))
        }
        disableReply={readOnly || !!identityError || paywallMissing}
        likesUpCount={upvotes}
        likesDownCount={downvotes}
        likeOption={getCommentLikeOption(commentid)}
        onLike={handleLikeComment}
        onDislike={handleDislikeComment}
        loadingLikeAction={loadingLikeAction[commentid]}
        showReplies={showReplies}
        isFlatMode={isFlatMode}
        onClickCensor={handleClickCensor}
        onClickReply={handleToggleReplyForm}
        onClickShowReplies={handleToggleReplies}
        numOfReplies={numOfReplies}
        numOfNewHiddenReplies={sumOfNewDescendants}
        commentBody={commentText}
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
