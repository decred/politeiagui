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
  classNames,
  Tooltip
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
import { useProposalsBatch } from "src/containers/Proposal/hooks";
import usePolicy from "src/hooks/api/usePolicy";
import {
  PROPOSAL_TYPE_REGULAR,
  PROPOSAL_TYPE_RFP,
  PROPOSAL_TYPE_RFP_SUBMISSION
} from "src/constants";
import {
  getProposalTypeOptionsForSelect,
  getRfpMinMaxDates
} from "./helpers.js";
import { isActiveApprovedRFP } from "src/containers/Proposal/helpers";
import useModalContext from "src/hooks/utils/useModalContext";

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
  const {
    policy: { minlinkbyperiod, maxlinkbyperiod }
  } = usePolicy();
  const isDarkTheme = themeName === "dark";
  const isRfp = values.type === PROPOSAL_TYPE_RFP;
  const isRfpSubmission = values.type === PROPOSAL_TYPE_RFP_SUBMISSION;

  const handleDescriptionChange = useCallback(
    (v) => {
      setFieldValue("description", v);
    },
    [setFieldValue]
  );

  const selectOptions = useMemo(() => getProposalTypeOptionsForSelect(), []);

  const deadlineRange = useMemo(
    () => getRfpMinMaxDates(minlinkbyperiod, maxlinkbyperiod),
    [maxlinkbyperiod, minlinkbyperiod]
  );

  const handleSelectFiledChange = useCallback(
    (fieldName) => (option) => {
      setFieldTouched(fieldName, true);
      setFieldValue(fieldName, option.value);
    },
    [setFieldValue, setFieldTouched]
  );

  const handleChangeWithTouched = (field) => (e) => {
    setFieldTouched(field, true);
    handleChange(e);
  };

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
      <Row
        noMargin
        className={classNames(
          styles.typeRow,
          isRfpSubmission && styles.typeRowNoMargin
        )}>
        <SelectField
          name="type"
          onChange={handleSelectFiledChange("type")}
          options={selectOptions}
          className={classNames(styles.typeSelectWrapper)}
        />
        {isRfp && (
          <>
            <DatePickerField
              className={styles.datePicker}
              years={deadlineRange}
              value={values.RfpDeadline}
              name="rfpDeadline"
              placeholder="Deadline"
            />
            <Tooltip
              contentClassName={styles.deadlineTooltip}
              placement={smallTablet ? "left" : "bottom"}
              content="The deadline for the RFP submissions,
              it can be edited at any point before the voting has been started and should be at least two weeks from now.">
              <div className={styles.iconWrapper}>
                <Icon type="info" size={smallTablet ? "md" : "lg"} />
              </div>
            </Tooltip>
          </>
        )}
        {isRfpSubmission && (
          <>
            <div className={styles.iconWrapper}>
              <Icon
                type={"horizontalLink"}
                viewBox="0 0 24 16"
                width={24}
                height={16}
              />
            </div>
            <BoxTextInput
              placeholder="RFP token"
              name="rfpLink"
              tabIndex={1}
              value={values.rfpLink}
              onChange={handleChangeWithTouched("rfpLink")}
              className={styles.rfpLinkToken}
              error={touched.rfpLink && errors.rfpLink}
            />
          </>
        )}
      </Row>
      <BoxTextInput
        placeholder="Proposal name"
        name="name"
        tabIndex={1}
        value={values.name}
        onChange={handleChangeWithTouched("name")}
        error={touched.name && errors.name}
      />
      <MarkdownEditor
        name="description"
        className="margin-top-s"
        value={values.description}
        textAreaProps={textAreaProps}
        onChange={handleDescriptionChange}
        placeholder={"Write your proposal"}
        error={touched.description && errors.description}
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
  const [handleOpenModal, handleCloseModal] = useModalContext();
  const openMdModal = useCallback(() => {
    handleOpenModal(ModalMDGuide, {
      onClose: handleCloseModal
    });
  }, [handleCloseModal, handleOpenModal]);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const { proposalFormValidation } = useProposalForm();
  const { onFetchProposalsBatch } = useProposalsBatch();
  const handleSubmit = useCallback(
    async (values, { resetForm, setSubmitting, setFieldError }) => {
      try {
        const { type, rfpLink, ...others } = values;
        if (type === PROPOSAL_TYPE_RFP_SUBMISSION) {
          const [[proposal], summaries] = (await onFetchProposalsBatch([
            rfpLink
          ])) || [[], null];
          const voteSummary = summaries && summaries[rfpLink];
          const isInvalidToken =
            !proposal ||
            !voteSummary ||
            !isActiveApprovedRFP(proposal, voteSummary);
          if (isInvalidToken) {
            throw Error("Invalid RFP token!");
          }
        }
        const proposalToken = await onSubmit({
          ...others,
          type,
          rfpLink
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
    [history, onSubmit, onFetchProposalsBatch]
  );
  return (
    <>
      <Formik
        initialValues={
          initialValues || {
            type: PROPOSAL_TYPE_REGULAR,
            rfpDeadline: null,
            rfpLink: "",
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
              openMDGuideModal: openMdModal,
              initialValues
            }}
          />
        )}
      </Formik>
    </>
  );
};

ProposalFormWrapper.propTypes = {
  initialValues: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  disableSubmit: PropTypes.bool
};

export default withRouter(ProposalFormWrapper);
