import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { CommentsFilter, CommentsList } from "./";
import { Card, H2 } from "pi-ui";
import styles from "./styles.module.css";
import { getThreadSchema } from "./utils";
import { useScrollTo } from "@politeiagui/common-ui/layout";

export const Comments = ({
  comments,
  isFlatMode,
  userVotes,
  onCensor,
  showCensor,
  parentId,
  scrollOnLoad,
}) => {
  const [sortedComments, setSortedComments] = useState(Object.values(comments));
  const [threadSchema, setThreadSchema] = useState();
  const [isFlat, setFlat] = useState(isFlatMode);
  // flat mode handler
  function handleToggleFlatMode() {
    setFlat(!isFlat);
  }

  function handleSortComments(sortFn) {
    const newSortedComments = sortFn(comments);
    setSortedComments(newSortedComments);
  }

  // Update schema for every filter change
  useEffect(() => {
    const schema = getThreadSchema(sortedComments, isFlat);
    setThreadSchema(schema);
  }, [sortedComments, isFlat]);

  const commentsCount = Object.keys(comments).length;

  useScrollTo("comments-list", scrollOnLoad);

  return (
    <div className={styles.commentsWrapper}>
      <Card paddingSize="small" className={styles.header}>
        <H2 className={styles.title}>
          Comments <span className={styles.count}>({commentsCount})</span>
        </H2>
        {!!commentsCount && (
          <CommentsFilter
            isFlat={isFlat}
            onSort={handleSortComments}
            onToggleFlatMode={handleToggleFlatMode}
          />
        )}
      </Card>
      <div className={styles.commentsList} id="comments-list">
        <CommentsList
          comments={comments}
          userVotes={userVotes}
          showCensor={showCensor}
          threadSchema={threadSchema}
          parentId={parentId}
          onCensor={onCensor}
        />
      </div>
    </div>
  );
};

Comments.propTypes = {
  comments: PropTypes.object.isRequired,
  isFlatMode: PropTypes.bool,
  userVotes: PropTypes.object,
  onCensor: PropTypes.func,
  showCensor: PropTypes.bool,
  parentId: PropTypes.number,
};

Comments.defaultProps = {
  parentId: 0,
};
