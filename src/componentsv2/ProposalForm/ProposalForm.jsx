import React, { useState } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { Formik } from "formik";
import { Button, Message, BoxTextInput } from "pi-ui";
import { Row } from "../layout";
import MarkdownEditor from "src/componentsv2/MarkdownEditor";
import ThumbnailGrid from "src/componentsv2/Files/Thumbnail";
import AttachFileButton from "src/componentsv2/AttachFileButton";
import ModalFullImage from "src/componentsv2/ModalFullImage";
import { useProposalForm, useFullImageModal } from "./hooks";
import DraftSaver from "./DraftSaver";

const ProposalForm = ({ initialValues, onSubmit, history, disableSubmit }) => {
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const { proposalFormValidation } = useProposalForm();
  const {
    showFullImageModal,
    openFullImageModal,
    closeFullImageModal
  } = useFullImageModal();
  async function handleSubmit(
    values,
    { resetForm, setSubmitting, setFieldError }
  ) {
    try {
      const proposalToken = await onSubmit(values);
      setSubmitting(false);
      setSubmitSuccess(true);
      history.push(`/proposal/${proposalToken}`);
      resetForm();
    } catch (e) {
      setSubmitting(false);
      setFieldError("global", e);
    }
  }

  return (
    <Formik
      initialValues={
        initialValues || {
          name: "",
          description: "",
          files: []
        }
      }
      loading={!proposalFormValidation}
      validate={proposalFormValidation}
      validateOnChange={true}
      onSubmit={handleSubmit}
    >
      {props => {
        const {
          values,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          touched,
          setFieldValue,
          errors,
          isValid
        } = props;
        function handleDescriptionChange(v) {
          setFieldValue("description", v);
        }
        function handleFilesChange(v) {
          const files = values.files.concat(v);
          setFieldValue("files", files);
        }
        function handleFileRemoval(v) {
          const fs = values.files.filter(f => f.payload !== v.payload);
          setFieldValue("files", fs);
        }
        const onClickFile = f => () => {
          openFullImageModal(f);
        };
        return (
          <form onSubmit={handleSubmit}>
            {errors && errors.global && (
              <Message kind="error">{errors.global.toString()}</Message>
            )}
            <BoxTextInput
              placeholder="Proposal name"
              name="name"
              tabIndex={1}
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.name && errors.name}
            />
            <MarkdownEditor
              name="description"
              className="margin-top-s"
              value={values.description}
              textAreaProps={{ tabIndex: 2 }}
              onChange={handleDescriptionChange}
              onBlur={handleBlur}
              placeholder={"Write your proposal"}
              error={touched.description && errors.description}
              filesInput={
                <AttachFileButton onChange={handleFilesChange} type="button" />
              }
            />
            <ThumbnailGrid
              value={values.files}
              onClick={onClickFile}
              onRemove={handleFileRemoval}
              errors={errors}
            />
            <Row justify="right" topMarginSize="s">
              <DraftSaver submitSuccess={submitSuccess} />
              <Button
                type="submit"
                kind={!isValid || disableSubmit ? "disabled" : "primary"}
                loading={isSubmitting}
              >
                Submit
              </Button>
            </Row>
            <ModalFullImage
              image={showFullImageModal}
              show={!!showFullImageModal}
              onClose={closeFullImageModal}
            />
          </form>
        );
      }}
    </Formik>
  );
};

ProposalForm.propTypes = {
  initialValues: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  disableSubmit: PropTypes.bool
};

export default withRouter(ProposalForm);
