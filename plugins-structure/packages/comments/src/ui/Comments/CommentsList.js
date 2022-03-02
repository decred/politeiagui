import React from "react";
import PropTypes from "prop-types";
import { CommentCard } from "../CommentCard";

export const CommentsList = ({
  comments,
  parentId = 0,
  showCensor,
  onCensor,
  threadSchema,
}) => {
  if (!threadSchema || !threadSchema[parentId]) {
    return null;
  }
  return threadSchema[parentId].map((childId) => {
    return (
      <CommentCard
        key={childId}
        comment={comments[childId]}
        onCensor={onCensor}
        threadLength={threadSchema[childId]?.length}
        showCensor={showCensor}
      >
        <CommentsList
          comments={comments}
          parentId={childId}
          threadSchema={threadSchema}
        />
      </CommentCard>
    );
  });
};

CommentsList.propTypes = {
  comments: PropTypes.object.isRequired,
  parentId: PropTypes.number,
  showCensor: PropTypes.bool,
  onCensor: PropTypes.func,
  threadSchema: PropTypes.object,
};
