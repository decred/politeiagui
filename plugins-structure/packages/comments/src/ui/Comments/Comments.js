import React, { useState } from "react";
import PropTypes from "prop-types";
import { CommentsFilter, CommentsList } from "./";
import { Card, H2 } from "pi-ui";
import styles from "./styles.module.css";

function getThreadSchema(commentsById, isFlatMode) {
  const threadSchema = Object.entries(commentsById).reduce(
    (acc, [id, comment]) => {
      if (isFlatMode) {
        return { 0: [...(acc[0] || []), id] };
      } else {
        return {
          ...acc,
          [comment.parentid]: [...(acc[comment.parentid] || []), id],
        };
      }
    },
    {}
  );
  return threadSchema;
}

export const Comments = ({ comments, isFlatMode }) => {
  const [threadSchema, setThreadSchema] = useState(
    getThreadSchema(comments, isFlatMode)
  );
  const [isFlat, setFlat] = useState(isFlatMode);
  // flat mode handler
  function handleToggleFlatMode() {
    const newSchema = getThreadSchema(comments, !isFlat);
    setFlat(!isFlat);
    setThreadSchema(newSchema);
  }
  return (
    <div>
      <Card paddingSize="small" className={styles.header}>
        <H2 className={styles.title}>
          Comments{" "}
          <span className={styles.count}>({Object.keys(comments).length})</span>
        </H2>
        <CommentsFilter
          isFlat={isFlat}
          onToggleFlatMode={handleToggleFlatMode}
        />
      </Card>
      <CommentsList
        comments={comments}
        threadSchema={threadSchema}
        parentid={0}
      />
    </div>
  );
};

Comments.propTypes = {
  comments: PropTypes.object.isRequired,
};
