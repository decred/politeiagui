import React, { useState } from "react";
import PropTypes from "prop-types";
import { ButtonIcon, Card, Link, classNames } from "pi-ui";
import { Event, Join, MarkdownRenderer } from "@politeiagui/common-ui";
import styles from "./styles.module.css";
import { CommentVotes } from "./CommentVotes";
import { CommentForm } from "../CommentForm";
import truncate from "lodash/truncate";
import { generatePath } from "@politeiagui/core/router";
import { getShortToken } from "@politeiagui/core";

const CensorButton = ({ onCensor }) => (
  <span
    className={styles.censor}
    onClick={onCensor}
    data-testid="comment-censor"
  >
    Censor
  </span>
);

const ParentPreview = ({ parentComment, link }) => {
  const truncatedComment = truncate(parentComment.comment, {
    length: 50,
    separator: " ",
    omission: " [...]",
  });
  return (
    <a className={styles.parentContext} data-link href={link}>
      @{parentComment.username}: {truncatedComment}
    </a>
  );
};

const CommentFooter = ({
  threadLength,
  disableReply,
  url,
  showThread,
  toggleDisplayForm,
}) => (
  <div className={styles.footer}>
    <Join inline>
      {threadLength > 0 && !showThread && (
        <a data-link href={url}>
          {threadLength} more repl{threadLength > 1 ? "ies" : "y"}
        </a>
      )}
      {!disableReply && (
        <span data-testid="comment-reply" onClick={toggleDisplayForm}>
          reply
        </span>
      )}
    </Join>
    <a href={url} data-link className={styles.discussion}>
      <ButtonIcon type="link" />
    </a>
  </div>
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
  disableReply,
  showParentCommentPreview,
  parentComment,
  depth,
  recordOwner,
  commentPath,
  isFlat,
}) => {
  const [showForm, setShowForm] = useState(false);
  if (!comment) return children;
  function handleCensorComment() {
    onCensor(comment);
  }
  function toggleDisplayForm() {
    setShowForm(!showForm);
  }

  const isRecordOwner = recordOwner === comment.username;
  const showThread = depth !== 6;

  const commentUrl = generatePath(commentPath, {
    token: getShortToken(comment.token),
    commentid: comment.commentid,
  });

  return (
    <>
      <div data-testid="comment-card">
        <Card
          className={classNames(
            styles.commentCard,
            comment.deleted && styles.censoredComment
          )}
        >
          {showParentCommentPreview && parentComment && (
            <ParentPreview
              parentComment={parentComment}
              link={generatePath(commentPath, {
                token: getShortToken(comment.token),
                commentid: parentComment.commentid,
              })}
            />
          )}
          <div className={styles.header}>
            <div className={styles.summary}>
              <Join>
                <Link
                  href={userLink}
                  data-testid="comment-author"
                  className={classNames(isRecordOwner && styles.recordOwner)}
                >
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
            {comment.deleted ? (
              `Censored. Reason: ${comment.reason}`
            ) : (
              <MarkdownRenderer
                body={comment.comment}
                disallowedElements={["h1", "h2", "h3", "h4", "h5", "h6"]}
              />
            )}
          </div>
          <CommentFooter
            threadLength={threadLength}
            disableReply={disableReply || comment.deleted}
            url={commentUrl}
            showThread={showThread}
            toggleDisplayForm={toggleDisplayForm}
          />
          {showForm && (
            <CommentForm onComment={onComment} parentId={comment.commentid} />
          )}
          {showThread && !isFlat && (
            <div className={styles.thread} data-testid="comment-thread">
              {children}
            </div>
          )}
        </Card>
      </div>
      {isFlat && children}
    </>
  );
};

CommentCard.propTypes = {
  comment: PropTypes.object,
  showCensor: PropTypes.bool,
  onCensor: PropTypes.func,
  children: PropTypes.node,
  threadLength: PropTypes.number,
  userLink: PropTypes.string,
  userVote: PropTypes.object,
  onComment: PropTypes.func,
  parentId: PropTypes.number,
  disableReply: PropTypes.bool,
  commentPath: PropTypes.string,
};

CommentCard.defaultProps = {
  threadLength: 0,
  userLink: "/#user",
  onComment: () => {},
  commentPath: "/record/:token/comment/:commentid",
};
