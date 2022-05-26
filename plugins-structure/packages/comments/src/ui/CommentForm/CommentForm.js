import React from "react";
import PropTypes from "prop-types";
import { Button } from "pi-ui";
import { Controller, useForm } from "react-hook-form";
import { MarkdownEditor } from "@politeiagui/common-ui";
import styles from "./styles.module.css";

export const CommentForm = ({
  onComment,
  onCancel,
  parentId,
  disableSubmit,
}) => {
  const { handleSubmit, control, setError, watch } = useForm();

  async function handleComment({ comment }) {
    try {
      await onComment(comment, parentId);
    } catch (error) {
      setError("comment", error);
    }
  }
  const comment = watch("comment");
  const enableSubmit = comment && comment !== "" && !disableSubmit;

  return (
    <form onSubmit={handleSubmit(handleComment)} className={styles.commentForm}>
      <Controller
        control={control}
        name="comment"
        render={({ field: { onChange } }) => (
          <MarkdownEditor onChange={onChange} hideButtonsMenu />
        )}
      />
      <div className={styles.commentButtons}>
        {onCancel && (
          <Button onClick={onCancel} kind="secondary">
            Cancel
          </Button>
        )}
        <Button type="submit" kind={enableSubmit ? "primary" : "disabled"}>
          Add Comment
        </Button>
      </div>
    </form>
  );
};

CommentForm.propTypes = {
  onComment: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  parentId: PropTypes.number,
};
