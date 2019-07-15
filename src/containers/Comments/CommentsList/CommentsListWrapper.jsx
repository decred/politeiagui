import React, { useState, useEffect } from "react";
import CommentsList from "./CommentsList";

const getChildren = (comments, commentId) => {
  return (
    comments.filter(comment => +comment.parentid === +commentId) || []
  ).map(comment => ({
    ...comment,
    children: getChildren(comments, comment.commentid)
  }));
};

const CommentsListWrapper = ({ comments, threadParentID }) => {
  const [nestedComments, setNestedComments] = useState([]);
  useEffect(
    function generateNestedComments() {
      // single thread mode: find the childrens of the thread parent comment
      if (threadParentID && !!comments.length) {
        const singleThreadParent = comments.find(
          c => +c.commentid === +threadParentID
        );
        setNestedComments([
          {
            ...singleThreadParent,
            children: getChildren(comments, threadParentID)
          }
        ]);
        return;
      }
      const result = getChildren(comments, 0);
      setNestedComments(result);
    },
    [comments, threadParentID]
  );
  return <CommentsList comments={nestedComments} />;
};

export default CommentsListWrapper;
