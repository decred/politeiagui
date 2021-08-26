import React, { useState, useEffect } from "react";
import CommentsList from "./CommentsList";

const getChildren = (comments, commentId, lastTimeAccessed, currentUserID) =>
  (comments.filter((comment) => +comment.parentid === +commentId) || []).map(
    (comment) =>
      createComputedComment(comment, comments, lastTimeAccessed, currentUserID)
  );

const createComputedComment = (
  comment,
  comments,
  lastTimeAccessed,
  currentUserID
) => {
  const children = getChildren(
    comments,
    comment.commentid,
    lastTimeAccessed,
    currentUserID
  );

  // set as true if this comment was created after the lastTimeAccessed
  // and the author is not the current user
  const isNew =
    lastTimeAccessed &&
    currentUserID !== comment.userid &&
    comment.timestamp > lastTimeAccessed;

  // count how many of the childrens are new comments
  const numOfNewChildren = children.filter((c) => c.isNew).length;

  // sum of all new descendants, including childrens
  const sumOfNewDescendants = children.reduce(
    (sum, c) => sum + c.sumOfNewDescendants,
    numOfNewChildren
  );

  return {
    ...comment,
    isNew,
    numOfNewChildren,
    sumOfNewDescendants,
    children
  };
};

const CommentsListWrapper = ({
  comments,
  threadParentID,
  lastTimeAccessed,
  currentUserID,
  isFlatMode,
  proposalState,
  recordsBaseLink
}) => {
  const [nestedComments, setNestedComments] = useState([]);
  // single thread mode: find the childrens of the thread parent comment
  const isSingleThread = threadParentID && !!comments.length;
  useEffect(
    function generateNestedComments() {
      // flat mode: keep comments array flat
      if (isFlatMode && !isSingleThread) {
        setNestedComments(
          comments.map((c) =>
            createComputedComment(c, comments, lastTimeAccessed, currentUserID)
          )
        );
        return;
      }
      if (isSingleThread) {
        const singleThreadParent = comments.find(
          (c) => +c.commentid === +threadParentID
        );
        setNestedComments([
          createComputedComment(
            singleThreadParent,
            comments,
            lastTimeAccessed,
            currentUserID
          )
        ]);
        return;
      }
      const result = getChildren(comments, 0, lastTimeAccessed, currentUserID);
      setNestedComments(result);
    },
    [
      comments,
      threadParentID,
      currentUserID,
      isFlatMode,
      lastTimeAccessed,
      isSingleThread
    ]
  );
  return (
    <CommentsList
      comments={nestedComments}
      isFlatMode={isSingleThread ? false : isFlatMode}
      proposalState={proposalState}
      recordBaseLink={recordsBaseLink}
    />
  );
};

export default React.memo(CommentsListWrapper);
