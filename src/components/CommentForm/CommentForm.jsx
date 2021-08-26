import React from "react";
import PropTypes from "prop-types";
import { Formik } from "formik";
import FormikPersist from "src/components/FormikPersist";
import { Button, Message, BoxTextInput } from "pi-ui";
import { Row } from "../layout";
import MarkdownEditor from "src/components/MarkdownEditor";
import validationSchema from "./validation";
import { usePolicy } from "src/hooks";

const forbiddenCommentsMdElements = ["h1", "h2", "h3", "h4", "h5", "h6"];

const CommentForm = ({
  onSubmit,
  onCancel,
  onCommentSubmitted,
  disableSubmit,
  persistKey,
  className,
  canReceiveAuthorUpdates
}) => {
  const {
    policyPi: { namesupportedchars, namelengthmax, namelengthmin }
  } = usePolicy();
  async function handleSubmit(
    { comment, title },
    { resetForm, setSubmitting, setFieldError }
  ) {
    try {
      await onSubmit({ comment: comment.trim(), title });
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
        title: canReceiveAuthorUpdates ? "" : null,
        comment: ""
      }}
      loading={!validationSchema}
      validationSchema={validationSchema({
        namesupportedchars,
        namelengthmax,
        namelengthmin
      })}
      onSubmit={handleSubmit}>
      {({
        values,
        handleBlur,
        handleSubmit,
        handleChange,
        isSubmitting,
        setFieldTouched,
        setFieldValue,
        errors,
        isValid,
        touched
      }) => {
        const handleTitleChangeWithTouched = (e) => {
          setFieldTouched("title", true);
          handleChange(e);
        };

        const handleCommentChange = (v) => setFieldValue("comment", v);

        return (
          <form onSubmit={handleSubmit} className={className}>
            {errors && errors.global && (
              <Message kind="error">{errors.global.toString()}</Message>
            )}
            {canReceiveAuthorUpdates && (
              <BoxTextInput
                placeholder="Update title"
                name="title"
                tabIndex={1}
                value={values.title}
                onChange={handleTitleChangeWithTouched}
                error={touched.title && errors.title}
              />
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
              placeholder="Write a comment"
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
