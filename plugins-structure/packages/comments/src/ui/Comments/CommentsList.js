import React from "react";
import PropTypes from "prop-types";
import { CommentCard } from "../CommentCard";

export const CommentsList = ({
  comments,
  parentId = 0,
  showCensor,
  onCensor,
  threadSchema,
  userVotes,
}) => {
  if (!threadSchema || !threadSchema[parentId]) {
    return null;
  }
  return threadSchema[parentId].map((childId) => (
    <CommentCard
      key={childId}
      comment={comments[childId]}
      onCensor={onCensor}
      threadLength={threadSchema[childId]?.length}
      showCensor={showCensor}
      userVote={userVotes[childId]}
      parentId={parentId}
    >
      <CommentsList
        comments={comments}
        showCensor={showCensor}
        onCensor={onCensor}
        parentId={childId}
        threadSchema={threadSchema}
        userVotes={userVotes}
      />
    </CommentCard>
  ));
};

CommentsList.propTypes = {
  comments: PropTypes.object.isRequired,
  parentId: PropTypes.number,
  showCensor: PropTypes.bool,
  onCensor: PropTypes.func,
  threadSchema: PropTypes.object,
};
