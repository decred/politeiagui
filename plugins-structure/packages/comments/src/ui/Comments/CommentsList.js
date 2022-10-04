import React from "react";
import PropTypes from "prop-types";
import { CommentCard } from "../CommentCard";

export const CommentsList = ({
  comments,
  parentId = 0,
  showCensor,
  onCensor,
  commentsByParent,
  userVotes,
  onReply,
  disableReply,
  isFlat,
  depth = 0,
  recordOwner,
  commentPath,
  previewId,
}) => {
  if (!commentsByParent || !commentsByParent[parentId]) {
    return null;
  }
  const comment = comments[parentId];

  return (
    <CommentCard
      depth={depth}
      comment={comment}
      onCensor={onCensor}
      threadLength={commentsByParent[parentId]?.length}
      showCensor={showCensor}
      userVote={userVotes[parentId]}
      onComment={onReply}
      disableReply={disableReply}
      showParentCommentPreview={isFlat || previewId === parentId}
      parentComment={comments[comment?.parentid]}
      recordOwner={recordOwner}
      commentPath={commentPath}
    >
      {commentsByParent[parentId].map((childId) => (
        <CommentsList
          key={childId}
          comments={comments}
          showCensor={showCensor}
          onCensor={onCensor}
          parentId={childId}
          commentsByParent={commentsByParent}
          userVotes={userVotes}
          onReply={onReply}
          disableReply={disableReply}
          isFlat={isFlat}
          depth={depth + 1}
          recordOwner={recordOwner}
          commentPath={commentPath}
        />
      ))}
    </CommentCard>
  );
};

CommentsList.propTypes = {
  comments: PropTypes.object.isRequired,
  parentId: PropTypes.number,
  showCensor: PropTypes.bool,
  onCensor: PropTypes.func,
  commentsByParent: PropTypes.object,
  userVotes: PropTypes.object,
  onReply: PropTypes.func,
  disableReply: PropTypes.bool,
  isFlat: PropTypes.bool,
};

CommentsList.defaultProps = {
  userVotes: {},
};
