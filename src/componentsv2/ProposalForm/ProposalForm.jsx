import React, { useState, useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { Formik } from "formik";
import {
  Button,
  Message,
  Text,
  BoxTextInput,
  useMediaQuery,
  useTheme,
  Link,
  classNames
} from "pi-ui";
import { Row } from "src/componentsv2/layout";
import styles from "./ProposalForm.module.css";
import MarkdownEditor from "src/componentsv2/MarkdownEditor";
import ThumbnailGrid from "src/componentsv2/Files";
import AttachFileInput from "src/componentsv2/AttachFileInput";
import ModalMDGuide from "src/componentsv2/ModalMDGuide";
import DraftSaver from "./DraftSaver";
import { useProposalForm } from "./hooks";
import useBooleanState from "src/hooks/utils/useBooleanState";

const ProposalForm = React.memo(function ProposalForm({
  values,
  handleChange,
  handleSubmit,
  isSubmitting,
  setFieldValue,
  errors,
  isValid,
  submitSuccess,
  disableSubmit,
  openMDGuideModal
}) {
  const mobile = useMediaQuery("(max-width: 560px)");

  const { themeName } = useTheme();
  const isDarkTheme = themeName === "dark";

  const handleDescriptionChange = useCallback(
    (v) => {
      setFieldValue("description", v);
    },
    [setFieldValue]
  );

  const handleFilesChange = useCallback(
    (v) => {
      const files = values.files.concat(v);
      setFieldValue("files", files);
    },
    [setFieldValue, values.files]
  );

  const handleFileRemoval = useCallback(
    (v) => {
      const fs = values.files.filter((f) => f.payload !== v.payload);
      setFieldValue("files", fs);
    },
    [setFieldValue, values.files]
  );

  const filesInput = useMemo(
    () => <AttachFileInput onChange={handleFilesChange} type="button" />,
    [handleFilesChange]
  );

  const textAreaProps = useMemo(() => ({ tabIndex: 2 }), []);

  const FormatHelpButton = () => (
    <Text
      weight="semibold"
      className={classNames(
        styles.formatHelpButton,
        isDarkTheme && styles.darkFormatHelpButton
      )}
      onClick={openMDGuideModal}>
      Formatting Help
    </Text>
  );

  const ProposalGuidelinesButton = () => (
    <Link
      weight="semibold"
      target="_blank"
      rel="noopener noreferrer"
      className={classNames(
        styles.proposalGuidelinesButton,
        isDarkTheme && styles.darkProposalGuidelinesButton
      )}
      href="https://docs.decred.org/governance/politeia/proposal-guidelines/">
      Proposal Guidelines
    </Link>
  );

  const SubmitButton = () => (
    <Button
      type="submit"
      kind={!isValid || disableSubmit ? "disabled" : "primary"}
      loading={isSubmitting}>
      Submit
    </Button>
  );

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
        error={errors.name}
      />
      <MarkdownEditor
        name="description"
        className="margin-top-s"
        value={values.description}
        textAreaProps={textAreaProps}
        onChange={handleDescriptionChange}
        placeholder={"Write your proposal"}
        error={errors.description}
        filesInput={filesInput}
      />
      <ThumbnailGrid
        value={values.files}
        onRemove={handleFileRemoval}
        errors={errors}
      />
      {!mobile ? (
        <Row topMarginSize="s" justify="right">
          <FormatHelpButton />
          <ProposalGuidelinesButton />
          <DraftSaver submitSuccess={submitSuccess} />
          <SubmitButton />
        </Row>
      ) : (
        <>
          <Row topMarginSize="s" justify="right">
            <DraftSaver submitSuccess={submitSuccess} />
            <SubmitButton />
          </Row>
          <Row topMarginSize="s" justify="right">
            <FormatHelpButton />
            <ProposalGuidelinesButton />
          </Row>
        </>
      )}
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
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const { proposalFormValidation } = useProposalForm();
  const handleSubmit = useCallback(
    async (values, { resetForm, setSubmitting, setFieldError }) => {
      try {
        const proposalToken = await onSubmit(values);
        setSubmitting(false);
        setSubmitSuccess(true);
        history.push(`/proposals/${proposalToken}`);
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
        onSubmit={handleSubmit}>
        {(props) => (
          <ProposalForm
            {...{
              ...props,
              submitSuccess,
              disableSubmit,
              openMDGuideModal,
              initialValues
            }}
          />
        )}
      </Formik>
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
