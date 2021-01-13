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
  H3,
  Link,
  classNames,
  Tooltip,
  DEFAULT_DARK_THEME_NAME
} from "pi-ui";
import { Row } from "src/components/layout";
import DatePickerField from "../DatePickerField";
import SelectField from "src/components/Select/SelectField";
import styles from "./ProposalForm.module.css";
import MarkdownEditor from "src/components/MarkdownEditor";
import ModalMDGuide from "src/components/ModalMDGuide";
import ThumbnailGrid from "src/components/Files";
import AttachFileInput from "src/components/AttachFileInput";
import DraftSaver from "./DraftSaver";
import { useProposalForm } from "./hooks";
import usePolicy from "src/hooks/api/usePolicy";
import {
  replaceBlobsByDigestsAndGetFiles,
  replaceImgDigestByBlob
} from "src/helpers";
import {
  PROPOSAL_TYPE_REGULAR,
  PROPOSAL_TYPE_RFP,
  PROPOSAL_TYPE_RFP_SUBMISSION,
  PROPOSAL_STATE_VETTED
} from "src/constants";
import {
  getProposalTypeOptionsForSelect,
  getRfpMinMaxDates,
  getRfpDeadlineTimestamp
} from "./helpers.js";
import { isActiveApprovedRfp } from "src/containers/Proposal/helpers";
import useModalContext from "src/hooks/utils/useModalContext";
import FormatHelpButton from "./FormatHelpButton";
import SubmitButton from "./SubmitButton";

/** The main goal of using a Map data structure instead of internal state here is to prevent unnecessary rerenders. We just want a way to map blobs to files objects. */
const mapBlobToFile = new Map();

const ListItem = ({ children }) => (
  <li className={styles.listItem}>{children}</li>
);

const Rules = () => (
  <>
    <H3>Rules:</H3>
    <ul className="margin-top-s margin-bottom-m">
      <ListItem>
        Expenses must be denominated in USD (but will be paid in DCR)
      </ListItem>
      <ListItem>
        The work will be paid next month after the month it was done, as
        explained{" "}
        <Link
          href="https://docs.decred.org/contributing/contributor-compensation/"
          target="_blank"
          rel="noopener noreferrer">
          here
        </Link>
      </ListItem>
      <ListItem>Proposal must include actionable plan</ListItem>
      <ListItem>
        Check{" "}
        <Link
          href="https://docs.decred.org/governance/politeia/proposal-guidelines/"
          target="_blank"
          rel="noopener noreferrer">
          Proposal Guidelines
        </Link>
      </ListItem>
    </ul>
  </>
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
  openMDGuideModal,
  isPublic
}) {
  const smallTablet = useMediaQuery("(max-width: 685px)");
  const { themeName } = useTheme();
  const {
    policyTicketVote: { linkbyperiodmin, linkbyperiodmax }
  } = usePolicy();
  const isDarkTheme = themeName === DEFAULT_DARK_THEME_NAME;
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
    () => getRfpMinMaxDates(linkbyperiodmin, linkbyperiodmax),
    [linkbyperiodmin, linkbyperiodmax]
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
          data-testid="proposal-type"
          options={selectOptions}
          className={styles.typeSelectWrapper}
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
            <Tooltip
              contentClassName={styles.deadlineTooltip}
              className={styles.tooltipWrapper}
              placement="left"
              content="The token for the RFP you are submitting on,
              it can be found on the RFP proposal page.">
              <div className={styles.iconWrapper}>
                <Icon type="info" size={smallTablet ? "md" : "lg"} />
              </div>
            </Tooltip>
          </>
        )}
      </Row>
      <BoxTextInput
        placeholder="Proposal name"
        name="name"
        data-testid="proposal-name"
        tabIndex={1}
        value={values.name}
        onChange={handleChangeWithTouched("name")}
        error={touched.name && errors.name}
      />
      <MarkdownEditor
        allowImgs={true}
        tabIndex={1}
        name="description"
        className="margin-top-s"
        data-testid="text-area"
        value={values.description}
        textAreaProps={textAreaProps}
        onChange={handleDescriptionChange}
        onFileChange={handleFilesChange}
        placeholder={"Write your proposal"}
        error={touched.description && errors.description}
        filesInput={filesInput}
        mapBlobToFile={mapBlobToFile}
      />
      <ThumbnailGrid
        value={values.files}
        onRemove={handleFileRemoval}
        errors={errors}
      />
      <Rules />
      {!smallTablet ? (
        <Row topMarginSize="s" justify="right">
          <FormatHelpButton
            isDarkTheme={isDarkTheme}
            openMDGuideModal={openMDGuideModal}
          />
          <DraftSaver
            mapBlobToFile={mapBlobToFile}
            submitSuccess={submitSuccess}
          />
          <SubmitButton
            isSubmitting={isSubmitting}
            disableSubmit={disableSubmit}
            isValid={isValid}
          />
        </Row>
      ) : (
        <>
          <Row topMarginSize="s" justify="right">
            <DraftSaver
              mapBlobToFile={mapBlobToFile}
              submitSuccess={submitSuccess}
            />
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
  const { text, markdownFiles } = replaceImgDigestByBlob(
    initialValues,
    mapBlobToFile
  );
  const [handleOpenModal, handleCloseModal] = useModalContext();
  const openMdModal = useCallback(() => {
    handleOpenModal(ModalMDGuide, {
      onClose: handleCloseModal
    });
  }, [handleCloseModal, handleOpenModal]);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const { proposalFormValidation, onFetchProposalsBatchWithoutState } =
    useProposalForm();
  const handleSubmit = useCallback(
    async (values, { resetForm, setSubmitting, setFieldError }) => {
      try {
        const { type, rfpLink, rfpDeadline, ...others } = values;
        const deadline = getRfpDeadlineTimestamp(rfpDeadline);
        if (type === PROPOSAL_TYPE_RFP_SUBMISSION) {
          const rfpWithVoteSummaries = (await onFetchProposalsBatchWithoutState(
            [rfpLink],
            PROPOSAL_STATE_VETTED
          )) || [[], null];
          const [proposals, summaries] = rfpWithVoteSummaries;
          const proposal = proposals[rfpLink];
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
        const { description, files } = replaceBlobsByDigestsAndGetFiles(
          others.description,
          mapBlobToFile
        );
        const proposalToken = await onSubmit({
          ...others,
          description,
          type,
          files: [...others.files, ...files],
          rfpLink,
          rfpDeadline: deadline
        });
        setSubmitting(false);
        setSubmitSuccess(true);
        // Navigate to record page.
        history.push(`/record/${proposalToken.substring(0, 7)}`);
        resetForm();
      } catch (e) {
        setSubmitting(false);
        setFieldError("global", e);
      }
    },
    [history, onSubmit, onFetchProposalsBatchWithoutState, isPublic]
  );

  const newInitialValues = initialValues
    ? {
        ...initialValues,
        description: text,
        files:
          initialValues &&
          initialValues.files.filter((file) => !markdownFiles.includes(file))
      }
    : {
        type: PROPOSAL_TYPE_REGULAR,
        rfpDeadline: null,
        rfpLink: "",
        name: "",
        description: "",
        files: []
      };
  return (
    <>
      <Formik
        initialValues={newInitialValues}
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
              newInitialValues,
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
