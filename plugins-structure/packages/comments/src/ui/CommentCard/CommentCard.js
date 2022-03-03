import React, { useState } from "react";
import PropTypes from "prop-types";
import { Card, Link, classNames } from "pi-ui";
import { Event, Join } from "@politeiagui/common-ui";
import styles from "./styles.module.css";
import { CommentVotes } from "./CommentVotes";

export const CommentCard = ({
  comment,
  showCensor,
  onCensor,
  children,
  threadLength,
  userLink,
  userVote,
}) => {
  const [showThread, setShowThread] = useState(true);
  function handleCensorComment() {
    onCensor(comment);
  }
  function toggleDisplayThread() {
    setShowThread(!showThread);
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
              <Link href={userLink}>{comment.username}</Link>
              <Event event="" timestamp={comment.timestamp} />
              {showCensor && !comment.deleted && (
                <span className={styles.censor} onClick={handleCensorComment}>
                  Censor
                </span>
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
        <div className={styles.body}>
          {comment.deleted
            ? `Censored. Reason: ${comment.reason}`
            : comment.comment}
        </div>
        <div className={styles.footer}>
          <span className={styles.reply}>Reply</span>
          {threadLength && (
            <span className={styles.collapse} onClick={toggleDisplayThread}>
              {showThread ? "-" : `+${threadLength}`}
            </span>
          )}
        </div>
      </Card>
      {showThread && <div className={styles.thread}>{children}</div>}
    </div>
  );
};

Comment.propTypes = {
  comment: PropTypes.object.isRequired,
  showCensor: PropTypes.bool,
};

Comment.defaultProps = {
  threadLength: 0,
  userLink: "/#user",
};
