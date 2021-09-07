import React from "react";
import PropTypes from "prop-types";
import { Formik } from "formik";
import FormikPersist from "src/components/FormikPersist";
import {
  H4,
  Button,
  Message,
  BoxTextInput,
  Tooltip,
  Icon,
  useMediaQuery,
  Text
} from "pi-ui";
import { Row } from "../layout";
import MarkdownEditor from "src/components/MarkdownEditor";
import validationSchema from "./validation";
import { usePolicy } from "src/hooks";
import useModalContext from "src/hooks/utils/useModalContext";
import ModalConfirm from "src/components/ModalConfirm";
import styles from "./CommentForm.module.css";

const forbiddenCommentsMdElements = ["h1", "h2", "h3", "h4", "h5", "h6"];

const CommentForm = ({
  onSubmit,
  onCancel,
  onCommentSubmitted,
  disableSubmit,
  persistKey,
  className,
  isAuthorUpdate,
  hasAuthorUpdates
}) => {
  const {
    policyPi: { namesupportedchars, namelengthmax, namelengthmin }
  } = usePolicy();
  const [handleOpenModal, handleCloseModal] = useModalContext();
  const smallTablet = useMediaQuery("(max-width: 685px)");
  async function handleSubmit(
    { comment, title },
    { resetForm, setSubmitting, setFieldError }
  ) {
    try {
      if (title && hasAuthorUpdates) {
        handleOpenModal(ModalConfirm, {
          title: "New author update",
          message:
            "Submitting a new update will lock the previous update thread. Are you sure you want to continue?",
          successTitle: "Author Update posted",
          successMessage: <Text>The update has been successfully posted!</Text>,
          onClose: handleCloseModal,
          onSubmit: async () => {
            await onSubmit({ comment: comment.trim(), title });
          }
        });
      } else {
        await onSubmit({ comment: comment.trim(), title });
      }
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
              <>
                <Row noMargin align="center" wrap={smallTablet}>
                  <H4 className="margin-bottom-s">Proposal Update</H4>
                  <Tooltip
                    contentClassName={styles.updateTitleTooltip}
                    className={styles.titleTooltipWrapper}
                    placement="right"
                    content="The proposal author is allowed to give periodic updates on the status of their proposal.  You can start an update thread by submitting a new comment.  Users
will only be able to reply to your most recent update thread.">
                    <div>
                      <Icon type="info" size={smallTablet ? "md" : "lg"} />
                    </div>
                  </Tooltip>
                </Row>
                <BoxTextInput
                  placeholder="Update title"
                  name="title"
                  tabIndex={1}
                  value={values.title}
                  onChange={handleTitleChangeWithTouched}
                  error={touched.title && errors.title}
                />
              </>
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
