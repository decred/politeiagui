import React from "react";
import PropTypes from "prop-types";
import { CommentCard } from "../CommentCard";
import { Button, Card, H2 } from "pi-ui";
import styles from "./styles.module.css";

export const Comments = ({ comments }) => {
  console.log("comments", comments);

  return (
    <div>
      <Card paddingSize="small" className={styles.header}>
        <H2 className={styles.title}>
          Comments{" "}
          <span className={styles.count}>({Object.keys(comments).length})</span>
        </H2>
        <div className={styles.filters}>
          <div>
            Sort by: <select></select>
          </div>
          <Button size="sm" kind="secondary">
            Flat Mode
          </Button>
        </div>
      </Card>
      {Object.values(comments).map((c) => (
        <CommentCard comment={c} showCensor={true} />
      ))}
    </div>
  );
};

Comments.propTypes = {
  comments: PropTypes.object.isRequired,
};
