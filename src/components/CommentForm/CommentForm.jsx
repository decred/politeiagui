import React from "react";
import PropTypes from "prop-types";
import { Formik } from "formik";
import FormikPersist from "src/components/FormikPersist";
import {
  Button,
  Message,
  BoxTextInput,
  Tooltip,
  Icon,
  useMediaQuery
} from "pi-ui";
import { Row } from "../layout";
import MarkdownEditor from "src/components/MarkdownEditor";
import validationSchema from "./validation";
import { usePolicy } from "src/hooks";
import styles from "./CommentForm.module.css";

const forbiddenCommentsMdElements = ["h1", "h2", "h3", "h4", "h5", "h6"];

const CommentForm = ({
  onSubmit,
  onCancel,
  onCommentSubmitted,
  disableSubmit,
  persistKey,
  className,
  isAuthorUpdate
}) => {
  const {
    policyPi: { namesupportedchars, namelengthmax, namelengthmin }
  } = usePolicy();
  const smallTablet = useMediaQuery("(max-width: 685px)");
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
        title: isAuthorUpdate ? "" : null,
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
            {isAuthorUpdate && (
              <Row noMargin align="center" wrap={smallTablet}>
                <BoxTextInput
                  placeholder="Update title"
                  name="title"
                  tabIndex={1}
                  className={styles.updateTitle}
                  value={values.title}
                  onChange={handleTitleChangeWithTouched}
                  error={touched.title && errors.title}
                />
                <Tooltip
                  contentClassName={styles.updateTitleTooltip}
                  className={styles.titleTooltipWrapper}
                  placement="left"
                  content={
                    <div>
                      <p>
                        Once a proposal vote has finished, all existing comment
                        threads are locked.
                      </p>
                      <br />
                      <p>
                        When a proposal author wants to give an update they will
                        start a new comment thread. The author is the only user
                        that will have the ability to start a new comment thread
                        once the voting period has finished. Each update will
                        have an author provided title.
                      </p>
                      <br />
                      <p>
                        Anyone can reply to any comments in the thread and can
                        cast upvotes/downvotes for any comments in the thread.
                      </p>
                      <br />
                      <p>
                        The comment thread will remain open until either the
                        author starts a new update thread or an admin marks the
                        proposal as closed/completed.
                      </p>
                    </div>
                  }>
                  <div>
                    <Icon type="info" size={smallTablet ? "md" : "lg"} />
                  </div>
                </Tooltip>
              </Row>
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
