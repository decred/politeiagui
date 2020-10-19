import React from "react";
import CommentWrapper from "../Comment/CommentWrapper";

const CommentsList = ({ comments, isFlatMode, proposalState }) =>
  comments.map((comment) => (
    <CommentWrapper
      key={`comment-${comment.commentid}`}
      comment={comment}
      numOfReplies={(comment.children && comment.children.length) || 0}
      isFlatMode={isFlatMode}
      proposalState={proposalState}>
      <CommentsList comments={comment.children} proposalState={proposalState} />
    </CommentWrapper>
  ));

export default CommentsList;
