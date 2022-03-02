import React from "react";
import PropTypes from "prop-types";
import { Card, Link } from "pi-ui";
import { Event, Join } from "@politeiagui/common-ui";
import styles from "./styles.module.css";

export const CommentCard = ({ comment, showCensor, onCensor, children }) => {
  function handleCensorComment() {
    onCensor(comment);
  }

  return (
    <Card paddingSize="small">
      <div className={styles.header}>
        <div className={styles.summary}>
          <Join>
            <Link href="#comment">{comment.username}</Link>
            <Event event="" timestamp={comment.timestamp} />
            {showCensor && (
              <span className={styles.censor} onClick={handleCensorComment}>
                Censor
              </span>
            )}
          </Join>
        </div>
        <div className={styles.actions}>
          <div>Like</div>
          <div>Dislike</div>
        </div>
      </div>
      <div className={styles.body}>{comment.comment}</div>
      <div className={styles.footer}>
        <span>Reply</span>
      </div>
      {children}
    </Card>
  );
};

Comment.propTypes = {
  comment: PropTypes.object.isRequired,
  showCensor: PropTypes.bool,
};
