import React from "react";
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
