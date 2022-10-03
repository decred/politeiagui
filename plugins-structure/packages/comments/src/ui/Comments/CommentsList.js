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
}) => {
  if (!commentsByParent || !commentsByParent[parentId]) {
    return null;
  }
  return commentsByParent[parentId].map((childId) => (
    <CommentCard
      key={childId}
      depth={depth}
      comment={comments[childId]}
      onCensor={onCensor}
      threadLength={commentsByParent[childId]?.length}
      showCensor={showCensor}
      userVote={userVotes[childId]}
      onComment={onReply}
      disableReply={disableReply}
      showParentCommentPreview={isFlat}
      parentComment={comments[comments[childId].parentid]}
      recordOwner={recordOwner}
    >
      <CommentsList
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
      />
    </CommentCard>
  ));
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
