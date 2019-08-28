import React, { useState } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { Formik } from "formik";
import { Button, Message, BoxTextInput, Text, useMediaQuery } from "pi-ui";
import { Row } from "../layout";
import styles from "./ProposalForm.module.css";
import MarkdownEditor from "src/componentsv2/MarkdownEditor";
import ThumbnailGrid from "src/componentsv2/Files/Thumbnail";
import AttachFileButton from "src/componentsv2/AttachFileButton";
import ModalFullImage from "src/componentsv2/ModalFullImage";
import ModalMDGuide from "src/componentsv2/ModalMDGuide";
import DraftSaver from "./DraftSaver";
import { useProposalForm, useFullImageModal } from "./hooks";
import useBooleanState from "src/hooks/utils/useBooleanState";

const ProposalForm = ({ initialValues, onSubmit, history, disableSubmit }) => {
  const mobile = useMediaQuery("(max-width: 560px)");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const { proposalFormValidation } = useProposalForm();
  const [
    showMDGuideModal, 
    openMDGuideModal, 
    closeMDGuideModal
  ] = useBooleanState(false);
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
            {!mobile ? (
              <Row justify="right" topMarginSize="s">
                <DraftSaver submitSuccess={submitSuccess} />
                <Text
                  weight="semibold"
                  color="gray"
                  className={styles.formatHelpButton}
                  style={{ marginRight: "40px"}}
                  onClick={() => openMDGuideModal()}
                >
                  Formatting Help
                </Text>
                <Button kind="secondary">Save as draft</Button>
                <Button
                  type="submit"
                  kind={!isValid && disableSubmit ? "disabled" : "primary"}
                  loading={isSubmitting}
                >
                  Submit
                </Button>
              </Row>
            ) : (
              <div className={styles.mobileColumn}>
                <Row justify="right" topMarginSize="s">  
                  <DraftSaver submitSuccess={submitSuccess} />              
                  <Button kind="secondary">Save as draft</Button>
                  <Button
                    type="submit"
                    kind={!isValid && disableSubmit ? "disabled" : "primary"}
                    loading={isSubmitting}
                  >
                    Submit
                  </Button>
                </Row>
                <Row justify="right" topMarginSize="s">
                  <Text
                    weight="semibold"
                    color="gray"
                    className={styles.formatHelpButton}
                    onClick={() => openMDGuideModal()}
                  >
                    Formatting Help
                  </Text>
                </Row>
              </div>
            )}
            <ModalFullImage
              image={showFullImageModal}
              show={!!showFullImageModal}
              onClose={closeFullImageModal}
            />          
            <ModalMDGuide show={showMDGuideModal} onClose={closeMDGuideModal} />
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
