import React from "react";
import CommentWrapper from "../Comment/CommentWrapper";

const CommentsList = ({ comments, isFlatMode }) => {
  return comments.map((comment) => (
    <CommentWrapper
      key={`comment-${comment.commentid}`}
      comment={comment}
      numOfReplies={(comment.children && comment.children.length) || 0}
      isFlatMode={isFlatMode}>
      <CommentsList comments={comment.children} />
    </CommentWrapper>
  ));
};

export default CommentsList;
