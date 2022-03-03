import React from "react";
import { Button, TextArea } from "pi-ui";
import { Formik } from "formik";
import styles from "./styles.module.css";

export const CommentForm = ({ onComment, onCancel, parentId }) => {
  async function handleSubmitComment({ comment }, actions) {
    try {
      actions.setSubmitting(true);
      await onComment(comment, parentId);
      actions.setSubmitting(false);
    } catch (error) {
      actions.setSubmitting(false);
      actions.setFieldError("comment", error);
    }
  }
  return (
    <Formik onSubmit={handleSubmitComment} initialValues={{ comment: "" }}>
      {(props) => (
        <form onSubmit={props.handleSubmit} className={styles.commentForm}>
          {/* TODO: Use Markdown Editor */}
          <TextArea
            name="comment"
            id="comment-text-area"
            onChange={props.handleChange}
            error={props.errors.comment}
          />
          <div className={styles.commentButtons}>
            {onCancel && (
              <Button onClick={onCancel} kind="secondary">
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              kind={
                props.isSubmitting || props.isValid ? "primary" : "disabled"
              }
            >
              Add Comment
            </Button>
          </div>
        </form>
      )}
    </Formik>
  );
};
