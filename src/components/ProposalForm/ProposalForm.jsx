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
  classNames,
  Select
} from "pi-ui";
import { Row } from "src/components/layout";
import styles from "./ProposalForm.module.css";
import MarkdownEditor from "src/components/MarkdownEditor";
import ThumbnailGrid from "src/components/Files";
import AttachFileInput from "src/components/AttachFileInput";
import ModalMDGuide from "src/components/ModalMDGuide";
import DraftSaver from "./DraftSaver";
import { useProposalForm } from "./hooks";
import useBooleanState from "src/hooks/utils/useBooleanState";
import {
  getProposalTypeOptionsForSelect,
  newProposalType
} from "./helpers.js";

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
  const smallTablet = useMediaQuery("(max-width: 685px)");
  const { themeName } = useTheme();
  const isDarkTheme = themeName === "dark";

  const handleDescriptionChange = useCallback(
    (v) => {
      setFieldValue("description", v);
    },
    [setFieldValue]
  );

  const selectOptions = useMemo(() => getProposalTypeOptionsForSelect(), []);

  const handleProposalTypeChange = useCallback(
    (option) => {
      setFieldValue("type", option);
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
    () => <AttachFileInput small onChange={handleFilesChange} type="button" />,
    [handleFilesChange]
  );

  const textAreaProps = useMemo(() => ({ tabIndex: 2 }), []);

  const FormatHelpButton = () => (
    <Text
      weight="semibold"
      className={classNames(
        styles.formatHelpButton,
        isDarkTheme && styles.darkButton
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
        isDarkTheme && styles.darkButton
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
      <Select
        value={values.type}
        onChange={handleProposalTypeChange}
        options={selectOptions}
        className={styles.selectWrapper}
      />
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
      {!smallTablet ? (
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
            type: newProposalType.REGULAR_PROPOSAL,
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
