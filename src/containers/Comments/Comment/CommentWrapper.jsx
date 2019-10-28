import React, { useState, useCallback, useMemo } from "react";
import styles from "./Comment.module.css";
import CommentForm from "src/componentsv2/CommentForm/CommentFormLazy";
import { useComment } from "../hooks";
import Comment from "./Comment";

const CommentWrapper = ({ comment, children, numOfReplies, ...props }) => {
  const {
    onSubmitComment,
    onLikeComment,
    getCommentLikeOption,
    enableCommentVote,
    recordAuthorID,
    loadingLikes,
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
    resultvotes,
    censored,
    timestamp,
    username,
    userid,
    isNew,
    upvotes,
    downvotes,
    sumOfNewDescendants
  } = comment;

  const isRecordAuthor = recordAuthorID === userid;
  const censorable = isAdmin && !readOnly;

  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showReplies, setShowReplies] = useState(true);

  const handleToggleReplyForm = useCallback(() => {
    setShowReplyForm(!showReplyForm);
  }, [showReplyForm]);

  const handleToggleReplies = useCallback(() => {
    setShowReplies(!showReplies);
  }, [showReplies]);

  const handleSubmitComment = useCallback(
    async comment => {
      return onSubmitComment({
        comment,
        token,
        parentID: commentid
      });
    },
    [token, commentid, onSubmitComment]
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

  const hasChildrenComments = useMemo(
    () =>
      !!React.Children.toArray(children).filter(
        child =>
          child.props && child.props.comments && !!child.props.comments.length
      ).length,
    [children]
  );

  const replies = useMemo(
    () => <div className={styles.childrenContainer}>{children}</div>,
    [children]
  );

  const commentContent = useMemo(
    () => (
      <>
        {showReplyForm && commentForm}
        {showReplies && hasChildrenComments && replies}
      </>
    ),
    [showReplyForm, showReplies, hasChildrenComments, commentForm, replies]
  );

  const handleClickCensor = useCallback(() => {
    return openCensorModal(commentid);
  }, [commentid, openCensorModal]);

  return (
    <>
      <Comment
        permalink={`/${recordType}/${recordToken}/comments/${commentid}`}
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
          readOnly ||
          (userLoggedIn && (identityError || paywallMissing))
        }
        disableReply={readOnly || !!identityError || paywallMissing}
        likesCount={resultvotes}
        likesUpCount={upvotes}
        likesDownCount={downvotes}
        likeOption={getCommentLikeOption(commentid)}
        onLike={handleLikeComment}
        onDislike={handleDislikeComment}
        showReplies={showReplies}
        onClickCensor={handleClickCensor}
        onClickReply={handleToggleReplyForm}
        onClickShowReplies={handleToggleReplies}
        numOfReplies={numOfReplies}
        numOfNewHiddenReplies={sumOfNewDescendants}
        commentBody={commentText}
        {...props}
      />
      {commentContent}
    </>
  );
};

export default CommentWrapper;
