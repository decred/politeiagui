import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { CommentsFilter, CommentsList } from "./";
import { Card, H2 } from "pi-ui";
import styles from "./styles.module.css";
import { getCommentsByParent } from "../../comments/utils";

export const Comments = ({
  comments,
  isFlatMode,
  userVotes,
  onCensor,
  showCensor,
  parentId,
  onReply,
  disableReply,
  title,
  recordOwner,
  commentPath,
  fullThreadUrl,
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
  const currentComment = comments[parentId];

  return parentId === 0 || currentComment ? (
    <div className={styles.commentsWrapper} data-testid="comments-section">
      <Card paddingSize="small" className={styles.header}>
        <H2 className={styles.title} data-testid="comments-section-title">
          {title} <span className={styles.count}>({commentsCount})</span>
        </H2>
        {!!commentsCount && (
          <CommentsFilter
            isFlat={isFlat}
            onSort={handleSortComments}
            onToggleFlatMode={handleToggleFlatMode}
            hideFlatModeButton={!!currentComment}
          />
        )}
        {currentComment && fullThreadUrl && (
          <div className={styles.fullThreadLink}>
            <a data-link href={fullThreadUrl}>
              view all comments
            </a>
          </div>
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
          isFlat={isFlat}
          previewId={currentComment?.commentid}
          recordOwner={recordOwner}
          commentPath={commentPath}
        />
      </div>
    </div>
  ) : null;
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
  title: PropTypes.string,
  recordOwner: PropTypes.string,
  commentPath: PropTypes.string,
  fullThreadUrl: PropTypes.string,
};

Comments.defaultProps = {
  parentId: 0,
  onReply: () => {},
  title: "Comments",
  isFlatMode: false,
};
