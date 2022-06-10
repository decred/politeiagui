import React from "react";
import CommentWrapper from "../Comment/CommentWrapper";

const CommentsList = ({
  comments,
  isFlatMode,
  proposalState,
  recordBaseLink
}) =>
  comments.map((comment) => (
    <CommentWrapper
      key={`comment-${comment.commentid}`}
      comment={comment}
      numOfReplies={(comment.children && comment.children.length) || 0}
      isFlatMode={isFlatMode}
      recordBaseLink={recordBaseLink}
      proposalState={proposalState}
    >
      <CommentsList
        comments={comment.children}
        proposalState={proposalState}
        recordBaseLink={recordBaseLink}
      />
    </CommentWrapper>
  ));

export default CommentsList;
