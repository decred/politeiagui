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
  recordOwner,
}) => {
  if (!commentsByParent || !commentsByParent[parentId]) {
    return null;
  }
  return commentsByParent[parentId].map((childId) => (
    <CommentCard
      key={childId}
      comment={comments[childId]}
      onCensor={onCensor}
      threadLength={commentsByParent[childId]?.length}
      showCensor={showCensor}
      userVote={userVotes[childId]}
      onComment={onReply}
      disableReply={disableReply}
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
};

CommentsList.defaultProps = {
  userVotes: {},
};
