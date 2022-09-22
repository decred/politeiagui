import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { CommentsFilter, CommentsList } from "./";
import { Card, H2 } from "pi-ui";
import styles from "./styles.module.css";
import { getCommentsByParent } from "../../comments/utils";
import { useScrollTo } from "@politeiagui/common-ui/layout";

export const Comments = ({
  comments,
  isFlatMode,
  userVotes,
  onCensor,
  showCensor,
  parentId,
  scrollOnLoad,
  onReply,
  disableReply,
  recordOwner,
}) => {
  const [sortedComments, setSortedComments] = useState(Object.values(comments));
  const [commentsByParent, setCommentsByParent] = useState();
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
    const schema = getCommentsByParent(sortedComments, isFlat);
    setCommentsByParent(schema);
  }, [sortedComments, isFlat]);

  const commentsCount = Object.keys(comments).length;

  useScrollTo("comments-wrapper", scrollOnLoad);

  return (
    <div
      className={styles.commentsWrapper}
      id="comments-wrapper"
      data-testid="comments-section"
    >
      <Card className={styles.header}>
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
      <div className={styles.commentsList}>
        <CommentsList
          comments={comments}
          userVotes={userVotes}
          showCensor={showCensor}
          commentsByParent={commentsByParent}
          parentId={parentId}
          onCensor={onCensor}
          onReply={onReply}
          disableReply={disableReply}
          recordOwner={recordOwner}
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
  onReply: PropTypes.func,
  disableReply: PropTypes.bool,
  recordOwner: PropTypes.string,
};

Comments.defaultProps = {
  parentId: 0,
  onReply: () => {},
};
