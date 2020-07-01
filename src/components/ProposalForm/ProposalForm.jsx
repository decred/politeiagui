import React, { useState, useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { Formik } from "formik";
import {
  Message,
  BoxTextInput,
  useMediaQuery,
  useTheme,
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
import usePolicy from "src/hooks/api/usePolicy";
import { isAnchoring } from "src/helpers";
import {
  PROPOSAL_TYPE_REGULAR,
  PROPOSAL_TYPE_RFP,
  PROPOSAL_TYPE_RFP_SUBMISSION
} from "src/constants";
import {
  getProposalTypeOptionsForSelect,
  getRfpMinMaxDates
} from "./helpers.js";
import { isActiveApprovedRfp } from "src/containers/Proposal/helpers";
import useModalContext from "src/hooks/utils/useModalContext";
import FormatHelpButton from "./FormatHelpButton";
import SubmitButton from "./SubmitButton";
import ProposalGuidelinesButton from "./ProposalGuidelinesButton";

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
  openMDGuideModal,
  isPublic
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

  return (
    <form onSubmit={handleSubmit}>
      {errors && errors.global && (
        <Message className="margin-bottom-m" kind="error">
          {errors.global.toString()}
        </Message>
      )}
      <Row
        noMargin
        wrap={smallTablet}
        className={classNames(
          styles.typeRow,
          isRfpSubmission && styles.typeRowNoMargin
        )}>
        <SelectField
          name="type"
          onChange={handleSelectFiledChange("type")}
          disabled={isPublic}
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
              className={styles.tooltipWrapper}
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
            {!smallTablet && (
              <div className={styles.iconWrapper}>
                <Icon
                  type={"horizontalLink"}
                  viewBox="0 0 24 16"
                  width={24}
                  height={16}
                />
              </div>
            )}
            <BoxTextInput
              placeholder="RFP token"
              name="rfpLink"
              tabIndex={1}
              value={values.rfpLink}
              disabled={isPublic}
              onChange={handleChangeWithTouched("rfpLink")}
              className={classNames(
                styles.rfpLinkToken,
                smallTablet && styles.topMargin
              )}
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
          <FormatHelpButton
            isDarkTheme={isDarkTheme}
            openMDGuideModal={openMDGuideModal}
          />
          <ProposalGuidelinesButton isDarkTheme={isDarkTheme} />
          <DraftSaver submitSuccess={submitSuccess} />
          <SubmitButton
            isSubmitting={isSubmitting}
            disableSubmit={disableSubmit}
            isValid={isValid}
          />
        </Row>
      ) : (
        <>
          <Row topMarginSize="s" justify="right">
            <DraftSaver submitSuccess={submitSuccess} />
            <SubmitButton
              isSubmitting={isSubmitting}
              disableSubmit={disableSubmit}
              isValid={isValid}
            />
          </Row>
          <Row topMarginSize="s" justify="right">
            <FormatHelpButton
              isDarkTheme={isDarkTheme}
              openMDGuideModal={openMDGuideModal}
            />
            <ProposalGuidelinesButton isDarkTheme={isDarkTheme} />
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
  history,
  isPublic
}) => {
  const [handleOpenModal, handleCloseModal] = useModalContext();
  const openMdModal = useCallback(() => {
    handleOpenModal(ModalMDGuide, {
      onClose: handleCloseModal
    });
  }, [handleCloseModal, handleOpenModal]);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const {
    proposalFormValidation,
    onFetchProposalsBatchWithoutState
  } = useProposalForm();
  const handleSubmit = useCallback(
    async (values, { resetForm, setSubmitting, setFieldError }) => {
      try {
        if (isAnchoring()) {
          throw new Error(
            "Submitting proposals is temporarily unavailable while a daily censorship resistance routine is in progress. Sorry for the inconvenience. This will be fixed soon. Check back in 10 minutes."
          );
        }
        const { type, rfpLink, ...others } = values;
        if (type === PROPOSAL_TYPE_RFP_SUBMISSION) {
          const rfpWithVoteSummaries = (await onFetchProposalsBatchWithoutState(
            [rfpLink]
          )) || [[], null];
          const [[proposal], summaries] = rfpWithVoteSummaries;
          const voteSummary = summaries && summaries[rfpLink];
          const isInvalidToken = !proposal || !voteSummary;
          if (isInvalidToken) {
            throw Error("Proposal not found!");
          }
          if (!isPublic && !isActiveApprovedRfp(proposal, voteSummary)) {
            throw Error(
              "Make sure token is associated with an approved & not expired RFP"
            );
          }
        }
        const proposalToken = await onSubmit({
          ...others,
          type,
          rfpLink
        });
        setSubmitting(false);
        setSubmitSuccess(true);
        // use short prefix when navigating to propsoal page
        history.push(`/proposals/${proposalToken.substring(0, 7)}`);
        resetForm();
      } catch (e) {
        setSubmitting(false);
        setFieldError("global", e);
      }
    },
    [history, onSubmit, onFetchProposalsBatchWithoutState, isPublic]
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
              initialValues,
              isPublic
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
