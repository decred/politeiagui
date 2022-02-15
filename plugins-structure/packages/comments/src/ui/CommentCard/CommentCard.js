import React from "react";
import PropTypes from "prop-types";
import { Card } from "pi-ui";
import styles from "./styles.module.css";

export const CommentCard = ({ comment }) => {
  console.log("comment", comment);

  return (
    <Card paddingSize="small">
      <div className={styles.header}>
        <div className={styles.summary}>Summary</div>
        <div className={styles.actions}>
          <div>Like</div>
          <div>Dislike</div>
        </div>
      </div>
      <div className={styles.body}>Body</div>
      <div className={styles.footer}>Footer</div>
    </Card>
  );
};

Comment.propTypes = {
  comment: PropTypes.object.isRequired,
};
