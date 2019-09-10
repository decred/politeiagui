import React, { useState, useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { Formik } from "formik";
import { Button, Message, BoxTextInput } from "pi-ui";
import styles from "./ProposalForm.module.css";
import MarkdownEditor from "src/componentsv2/MarkdownEditor";
import { ThumbnailGrid } from "src/componentsv2/Files/Thumbnail";
import AttachFileInput from "src/componentsv2/AttachFileInput";
import ModalFullImage from "src/componentsv2/ModalFullImage";
import ModalMDGuide from "src/componentsv2/ModalMDGuide";
import DraftSaver from "./DraftSaver";
import { useProposalForm, useFullImageModal } from "./hooks";
import useBooleanState from "src/hooks/utils/useBooleanState";

const ProposalForm = React.memo(function ProposalForm({
  values,
  handleChange,
  handleBlur,
  handleSubmit,
  isSubmitting,
  touched,
  setFieldValue,
  errors,
  isValid,
  submitSuccess,
  disableSubmit,
  openMDGuideModal,
  openFullImageModal
}) {
  const handleDescriptionChange = useCallback(
    v => {
      setFieldValue("description", v);
    },
    [setFieldValue]
  );

  const handleFilesChange = useCallback(
    v => {
      const files = values.files.concat(v);
      setFieldValue("files", files);
    },
    [setFieldValue, values.files]
  );

  const handleFileRemoval = useCallback(
    v => {
      const fs = values.files.filter(f => f.payload !== v.payload);
      setFieldValue("files", fs);
    },
    [setFieldValue, values.files]
  );

  const onClickFile = useCallback(
    f => () => {
      openFullImageModal(f);
    },
    [openFullImageModal]
  );

  const filesInput = useMemo(
    () => <AttachFileInput onChange={handleFilesChange} type="button" />,
    [handleFilesChange]
  );

  const textAreaProps = useMemo(() => ({ tabIndex: 2 }), []);

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
        textAreaProps={textAreaProps}
        onChange={handleDescriptionChange}
        onBlur={handleBlur}
        placeholder={"Write your proposal"}
        error={touched.description && errors.description}
        filesInput={filesInput}
      />
      <ThumbnailGrid
        value={values.files}
        onClick={onClickFile}
        onRemove={handleFileRemoval}
        errors={errors}
      />
      <div className={styles.actionsWrapper}>
        <Button
          color="gray"
          type="button"
          kind="secondary"
          className={styles.formatHelpButton}
          onClick={() => openMDGuideModal()}
        >
          Formatting Help
        </Button>
        <DraftSaver submitSuccess={submitSuccess} />
        <Button
          type="submit"
          kind={!isValid && disableSubmit ? "disabled" : "primary"}
          loading={isSubmitting}
        >
          Submit
        </Button>
      </div>
    </form>
  );
});

const ProposalFormWrapper = ({
  initialValues,
  onSubmit,
  disableSubmit,
  history
}) => {
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
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const { proposalFormValidation } = useProposalForm();
  const handleSubmit = useCallback(
    async (values, { resetForm, setSubmitting, setFieldError }) => {
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
    },
    [history, onSubmit]
  );
  return (
    <>
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
        {props => (
          <ProposalForm
            {...{
              ...props,
              submitSuccess,
              disableSubmit,
              openFullImageModal,
              openMDGuideModal
            }}
          />
        )}
      </Formik>
      <ModalFullImage
        image={showFullImageModal}
        show={!!showFullImageModal}
        onClose={closeFullImageModal}
      />
      <ModalMDGuide show={showMDGuideModal} onClose={closeMDGuideModal} />
    </>
  );
};

ProposalFormWrapper.propTypes = {
  initialValues: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  disableSubmit: PropTypes.bool
};

export default withRouter(ProposalFormWrapper);
