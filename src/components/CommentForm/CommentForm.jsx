import React from "react";
import PropTypes from "prop-types";
import { Formik } from "formik";
import FormikPersist from "src/components/FormikPersist";
import { Button, Message } from "pi-ui";
import { Row } from "../layout";
import MarkdownEditor from "src/components/MarkdownEditor";
import validationSchema from "./validation";

const forbiddenCommentsMdElements = ["h1", "h2", "h3", "h4", "h5", "h6"];

const CommentForm = ({
  onSubmit,
  onCancel,
  onCommentSubmitted,
  disableSubmit,
  persistKey,
  className
}) => {
  async function handleSubmit(
    values,
    { resetForm, setSubmitting, setFieldError }
  ) {
    try {
      await onSubmit(values.comment.trim());
      setSubmitting(false);
      resetForm();
      onCommentSubmitted && onCommentSubmitted();
    } catch (e) {
      setSubmitting(false);
      setFieldError("global", e);
    }
  }
  return (
    <Formik
      initialValues={{
        comment: ""
      }}
      loading={!validationSchema}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}>
      {(formikProps) => {
        const {
          values,
          handleBlur,
          handleSubmit,
          isSubmitting,
          setFieldValue,
          errors,
          isValid
        } = formikProps;
        function handleCommentChange(v) {
          setFieldValue("comment", v);
        }
        return (
          <form onSubmit={handleSubmit} className={className}>
            {errors && errors.global && (
              <Message kind="error">{errors.global.toString()}</Message>
            )}
            <MarkdownEditor
              allowImgs={false}
              allowHeaders={false}
              name="comment"
              className="margin-top-s"
              value={values.comment}
              onChange={handleCommentChange}
              onBlur={handleBlur}
              disallowedElements={forbiddenCommentsMdElements}
              placeholder={"Write a comment"}
            />
            <Row justify="right" topMarginSize="s">
              {!!onCancel && (
                <Button type="button" kind="secondary" onClick={onCancel}>
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                kind={!isValid || disableSubmit ? "disabled" : "primary"}
                loading={isSubmitting}>
                Add comment
              </Button>
            </Row>
            {!!persistKey && <FormikPersist name={persistKey} />}
          </form>
        );
      }}
    </Formik>
  );
};

CommentForm.propTypes = {
  className: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  onCommentSubmitted: PropTypes.func,
  disableSubmit: PropTypes.bool,
  persistKey: PropTypes.string
};

export default React.memo(CommentForm);
