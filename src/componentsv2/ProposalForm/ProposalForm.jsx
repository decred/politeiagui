import React from "react";
import { withRouter } from "react-router-dom";
import { Formik } from "formik";
import { Card, TextInput, Button, Message, BoxTextInput } from "pi-ui";
import { Row } from "../layout";
import MarkdownEditor from "src/componentsv2/MarkdownEditor";
import FilesInput from "src/componentsv2/Files/Input";
import AttachFileButton from "src/componentsv2/AttachFileButton";
import styles from "./ProposalForm.module.css";
import { useProposalForm } from "./hooks";

const ProposalForm = ({ initialValues, onSubmit, history }) => {
  const { validationSchema, policy } = useProposalForm();
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
    <Card paddingSize="small">
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
            isValid,
            dirty
          } = props;
          function handleDescriptionChange(v) {
            setFieldValue("description", v);
          }
          function handleFilesChange(v) {
            setFieldValue("files", v);
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
                filesInput={
                  <FilesInput value={values.files} onChange={handleFilesChange}>
                    <AttachFileButton type="button" />
                  </FilesInput>
                }
              />
              <Row justify="right" topMarginSize="s">
                <Button kind="secondary">Save as draft</Button>
                <Button
                  type="submit"
                  kind={!isValid ? "disabled" : "primary"}
                  loading={isSubmitting}
                >
                  Submit
                </Button>
              </Row>
            </form>
          );
        }}
      </Formik>
    </Card>
  );
};

export default withRouter(ProposalForm);
