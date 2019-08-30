import React, { useState } from "react";
import styles from "./Comment.module.css";
import { Text } from "pi-ui";
import ModalConfirmWithReason from "src/componentsv2/ModalConfirmWithReason";
import CommentForm from "src/componentsv2/CommentForm";
import useBooleanState from "src/hooks/utils/useBooleanState";
import { useComment } from "../hooks";
import Comment from "./Comment";

const CommentWrapper = ({ comment, children, numOfReplies, ...props }) => {
  const {
    onSubmitComment,
    onLikeComment,
    onCensorComment,
    getCommentLikeOption,
    enableCommentVote,
    recordAuthorID,
    loadingLikes,
    userLoggedIn,
    userEmail,
    isAdmin,
    recordToken,
    recordType,
    threadParentID,
    readOnly,
    identityError,
    paywallMissing,
    openLoginModal
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
    parentid,
    isNew,
    sumOfNewDescendants
  } = comment;

  const isRecordAuthor = recordAuthorID === userid;
  const isThreadParent = +parentid === 0 || +commentid === +threadParentID;

  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showReplies, setShowReplies] = useState(isThreadParent);

  const [
    showCensorModal,
    openCensorModal,
    closeCensorModal
  ] = useBooleanState(false);

  function handleToggleReplyForm() {
    setShowReplyForm(!showReplyForm);
  }
  function handleToggleReplies() {
    setShowReplies(!showReplies);
  }

  async function handleSubmitComment(comment) {
    return onSubmitComment({
      comment,
      token,
      parentID: commentid
    });
  }
  function handleCommentSubmitted() {
    setShowReplyForm(false);
    setShowReplies(true);
  }
  async function handleLikeComment() {
    if (!userLoggedIn) {
      openLoginModal();
      return;
    }
    return onLikeComment(commentid, "1");
  }
  function handleDislikeComment() {
    if (!userLoggedIn) {
      openLoginModal();
      return;
    }
    return onLikeComment(commentid, "-1");
  }
  const hasChildrenComments = !!React.Children.toArray(children).filter(
    child =>
      child.props && child.props.comments && !!child.props.comments.length
  ).length;

  return (
    <>
      <Comment
        permalink={`/${recordType}/${recordToken}/comments/${commentid}`}
        topLevelComment={isThreadParent}
        author={username}
        authorID={userid}
        createdAt={timestamp}
        highlightAuthor={isRecordAuthor}
        highlightAsNew={isNew}
        disableLikes={!enableCommentVote}
        disableLikesClick={
          loadingLikes || readOnly || (userLoggedIn && identityError)
        }
        disableReply={readOnly || !!identityError || paywallMissing}
        likesCount={resultvotes}
        likeOption={getCommentLikeOption(commentid)}
        onLike={handleLikeComment}
        onDislike={handleDislikeComment}
        showReplies={showReplies}
        onClickReply={handleToggleReplyForm}
        onClickShowReplies={handleToggleReplies}
        numOfReplies={numOfReplies}
        commentBody={commentText}
        numOfNewHiddenReplies={sumOfNewDescendants}
        {...props}
      />
      {showReplyForm && (
        <CommentForm
          className={styles.replyForm}
          persistKey={`replying-to-${commentid}-from-${token}`}
          onSubmit={handleSubmitComment}
          onCommentSubmitted={handleCommentSubmitted}
        />
      )}
      {showReplies && hasChildrenComments && (
        <div className={styles.childrenContainer}>{children}</div>
      )}
    </>
  );
};

export default CommentWrapper;
