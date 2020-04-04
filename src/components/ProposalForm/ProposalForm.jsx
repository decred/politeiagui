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
  Icon,
  classNames
} from "pi-ui";
import { Row } from "src/components/layout";
import DatePickerField from "../DatePickerField";
import SelectField from "src/components/Select/SelectField";
import styles from "./ProposalForm.module.css";
import MarkdownEditor from "src/components/MarkdownEditor";
import ThumbnailGrid from "src/components/Files";
import AttachFileInput from "src/components/AttachFileInput";
import ModalMDGuide from "src/components/ModalMDGuide";
import DraftSaver from "./DraftSaver";
import { useProposalForm } from "./hooks";
import useBooleanState from "src/hooks/utils/useBooleanState";
import {
  PROPOSAL_TYPE_REGULAR,
  PROPOSAL_TYPE_RFP,
  PROPOSAL_TYPE_RFP_SUBMISSION
} from "src/constants";
import {
  getProposalTypeOptionsForSelect,
  getRfpMinMaxDates
} from "./helpers.js";

const Select = ({ error, ...props }) => (
  <div className={classNames(error && styles.formSelectError)}>
    <SelectField {...props} />
    {error && <p className={styles.errorMsg}>{error}</p>}
  </div>
);

const ProposalForm = React.memo(function ProposalForm({
  values,
  handleChange,
  handleSubmit,
  isSubmitting,
  setFieldValue,
  setFieldTouched,
  errors,
  isValid,
  touched,
  submitSuccess,
  disableSubmit,
  openMDGuideModal
}) {
  const smallTablet = useMediaQuery("(max-width: 685px)");
  const { themeName } = useTheme();
  const isDarkTheme = themeName === "dark";
  const isRfp = values.type.value === PROPOSAL_TYPE_RFP;
  const isRfpSubmission = values.type.value === PROPOSAL_TYPE_RFP_SUBMISSION;

  const handleDescriptionChange = useCallback(
    (v) => {
      setFieldValue("description", v);
    },
    [setFieldValue]
  );

  const selectOptions = useMemo(() => getProposalTypeOptionsForSelect(), []);

  const handleSelectFiledChange = useCallback(
    (fieldName) => (option) => {
      setFieldTouched(fieldName, true);
      setFieldValue(fieldName, option);
    },
    [setFieldValue, setFieldTouched]
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
      <Row>
        <Select
          name="type"
          onChange={handleSelectFiledChange("type")}
          options={selectOptions}
          error={touched.type && errors.type}
          className={classNames(styles.typeSelectWrapper, styles.selectWrapper)}
        />
        {isRfp && (
          <DatePickerField
            className={styles.datePicker}
            years={getRfpMinMaxDates()}
            value={values.RfpDeadline}
            name="rfpDeadline"
            label="Deadline"
          />
        )}
        {isRfpSubmission && (
          <Row noMargin align="center">
            <div className={classNames("margin-left-s", "margin-right-s")}>
              <Icon
                type={"horizontalLink"}
                viewBox="0 0 24 16"
                width={24}
                height={16}
              />
            </div>
            <Select
              name="submissionLink"
              onChange={handleSelectFiledChange("type")}
              options={[]}
              error={touched.submissionLink && errors.submissionLink}
              placeholder="Choose RFP proposal"
              className={classNames(
                styles.rfpLinkSelectWrapper,
                styles.selectWrapper
              )}
            />
          </Row>
        )}
      </Row>
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
        const {
          type: { value },
          ...others
        } = values;
        const proposalToken = await onSubmit({
          ...others,
          type: value
        });
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
            type: PROPOSAL_TYPE_REGULAR,
            rfpDeadline: { year: 2020, day: 1, month: 4 }, // TODO: make datepicker work with no initial value
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
