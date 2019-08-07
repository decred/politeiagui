import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { Formik } from "formik";
import { Button, Message, BoxTextInput } from "pi-ui";
import { Row } from "../layout";
import MarkdownEditor from "src/componentsv2/MarkdownEditor";
import FilesInput from "src/componentsv2/Files/Input";
import FilesThumbnail from "src/componentsv2/Files/Thumbnail";
import AttachFileButton from "src/componentsv2/AttachFileButton";
import { useProposalForm } from "./hooks";

const ProposalForm = ({ initialValues, onSubmit, history, disableSubmit }) => {
  const { validationSchema } = useProposalForm();
  async function handleSubmit(
    values,
    { resetForm, setSubmitting, setFieldError }
  ) {
    try {
      const proposalToken = await onSubmit(values);
      setSubmitting(false);
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
      loading={!validationSchema}
      validationSchema={validationSchema}
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
          setFieldValue("files", v);
        }
        function handleFileRemoval(v) {
          const fs = values.files.filter(f => f.payload !== v.payload);
          setFieldValue("files", fs);
        }
        return (
          <form onSubmit={handleSubmit}>
            {errors && errors.global && (
              <Message kind="error">{errors.global.toString()}</Message>
            )}
            <BoxTextInput
              placeholder="Proposal name"
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.name && errors.name}
            />
            <MarkdownEditor
              name="description"
              className="margin-top-s"
              value={values.description}
              onChange={handleDescriptionChange}
              onBlur={handleBlur}
              placeholder={"Write your proposal"}
              error={touched.name && errors.name}
              filesInput={
                <FilesInput value={values.files} onChange={handleFilesChange}>
                  <AttachFileButton type="button" />
                </FilesInput>
              }
            />
            <FilesThumbnail 
              value={values.files}
              errors={errors.files ? errors.files : null}
              onClick={handleFileRemoval}
            />
            <Row justify="right" topMarginSize="s">
              <Button kind="secondary">Save as draft</Button>
              <Button
                type="submit"
                kind={!isValid && disableSubmit ? "disabled" : "primary"}
                loading={isSubmitting}
              >
                Submit
              </Button>
            </Row>
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
