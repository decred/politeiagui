import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { CommentsFilter, CommentsList } from "./";
import { Card, H2 } from "pi-ui";
import styles from "./styles.module.css";
import { getThreadSchema, sortByNew, sortByOld, sortByTop } from "./utils";

export const Comments = ({ comments, isFlatMode }) => {
  const [sortedComments, setSortedComments] = useState(Object.values(comments));
  const [threadSchema, setThreadSchema] = useState();
  const [isFlat, setFlat] = useState(isFlatMode);
  // flat mode handler
  function handleToggleFlatMode() {
    setFlat(!isFlat);
  }
  // sort handler
  function handleSortComments(op) {
    let newCommentsList;
    switch (op) {
      case "new":
        newCommentsList = sortByNew(comments);
        break;
      case "old":
        newCommentsList = sortByOld(comments);
        break;
      default:
        newCommentsList = sortByTop(comments);
        break;
    }
    setSortedComments(newCommentsList);
  }

  // Update schema for every filter change
  useEffect(() => {
    const schema = getThreadSchema(sortedComments, isFlat);
    setThreadSchema(schema);
  }, [sortedComments, isFlat]);

  return (
    <div>
      <Card paddingSize="small" className={styles.header}>
        <H2 className={styles.title}>
          Comments{" "}
          <span className={styles.count}>({Object.keys(comments).length})</span>
        </H2>
        <CommentsFilter
          isFlat={isFlat}
          onSort={handleSortComments}
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
  isFlatMode: PropTypes.bool,
};
