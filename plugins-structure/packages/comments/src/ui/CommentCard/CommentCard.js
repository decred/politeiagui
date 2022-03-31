import React, { useState } from "react";
import PropTypes from "prop-types";
import { Card, Link, classNames } from "pi-ui";
import { Event, Join } from "@politeiagui/common-ui";
import styles from "./styles.module.css";
import { CommentVotes } from "./CommentVotes";
import { CommentForm } from "../CommentForm";

const CensorButton = ({ onCensor }) => (
  <span
    className={styles.censor}
    onClick={onCensor}
    data-testid="comment-censor"
  >
    Censor
  </span>
);

export const CommentCard = ({
  comment,
  showCensor,
  onCensor,
  children,
  threadLength,
  userLink,
  userVote,
  onComment,
  parentId,
  disableReply,
}) => {
  const [showThread, setShowThread] = useState(true);
  const [showForm, setShowForm] = useState(false);
  function handleCensorComment() {
    onCensor(comment);
  }
  function toggleDisplayThread() {
    setShowThread(!showThread);
  }
  function toggleDisplayForm() {
    setShowForm(!showForm);
  }

  return (
    <div>
      <Card
        className={classNames(
          styles.commentCard,
          comment.deleted && styles.censoredComment
        )}
      >
        <div className={styles.header}>
          <div className={styles.summary}>
            <Join>
              <Link href={userLink} data-testid="comment-author">
                {comment.username}
              </Link>
              <Event event="" timestamp={comment.timestamp} />
              {showCensor && !comment.deleted && (
                <CensorButton onCensor={handleCensorComment} />
              )}
            </Join>
          </div>
          <CommentVotes
            hide={comment.deleted}
            upvotes={comment.upvotes}
            userVote={userVote?.vote}
            downvotes={comment.downvotes}
          />
        </div>
        {/* TODO: get comment censorship user */}
        <div className={styles.body} data-testid="comment-body">
          {comment.deleted
            ? `Censored. Reason: ${comment.reason}`
            : comment.comment}
        </div>
        <div className={styles.footer}>
          {!disableReply && (
            <span
              className={styles.reply}
              data-testid="comment-reply"
              onClick={toggleDisplayForm}
            >
              Reply
            </span>
          )}
          {threadLength > 0 && (
            <span className={styles.collapse} onClick={toggleDisplayThread}>
              {showThread ? "-" : `+${threadLength}`}
            </span>
          )}
        </div>
      </Card>
      {showForm && <CommentForm onComment={onComment} parentId={parentId} />}
      {showThread && (
        <div className={styles.thread} data-testid="comment-thread">
          {children}
        </div>
      )}
    </div>
  );
};

CommentCard.propTypes = {
  comment: PropTypes.object.isRequired,
  showCensor: PropTypes.bool,
  onCensor: PropTypes.func,
  children: PropTypes.node,
  threadLength: PropTypes.number,
  userLink: PropTypes.string,
  userVote: PropTypes.object,
  onComment: PropTypes.func,
  parentId: PropTypes.number,
  disableReply: PropTypes.bool,
};

CommentCard.defaultProps = {
  threadLength: 0,
  userLink: "/#user",
  onComment: () => {},
};
