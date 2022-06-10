import React, { useMemo, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { BoxTextInput, Button, Message, Spinner } from "pi-ui";
import { Formik } from "formik";
import { withRouter } from "react-router-dom";
import InvoiceDatasheet, {
  generateBlankLineItem
} from "src/components/InvoiceDatasheet";
import MonthPickerField from "../MonthPickerField";
import AttachFileInput from "src/components/AttachFileInput";
import {
  getInitialDateValue,
  getInvoiceMinMaxYearAndMonth
} from "src/containers/Invoice";
import usePolicy from "src/hooks/api/usePolicy";
import {
  invoiceValidationSchema,
  improveLineItemErrors,
  generateFilesValidatorByPolicy
} from "./validation";
import useContractor from "src/containers/User/Detail/hooks/useContractor";
import DraftSaver from "./DraftSaver";
import ThumbnailGrid from "src/components/Files";
import ExchangeRateField from "./ExchangeRateField";
import useSessionStorage from "src/hooks/utils/useSessionStorage";
import useScrollFormOnError from "src/hooks/utils/useScrollFormOnError";
import styles from "./InvoiceForm.module.css";

const InvoiceForm = React.memo(function InvoiceForm({
  values,
  handleChange,
  handleSubmit,
  isSubmitting,
  setFieldValue,
  setFieldTouched,
  setFieldError,
  errors,
  touched,
  isValid: isFormValid,
  submitSuccess,
  setSessionStorageInvoice,
  approvedProposals,
  approvedProposalsError,
  validateFiles,
  requireGitHubName,
  isEditing
}) {
  const files = values.files;
  useScrollFormOnError(errors && errors.global);
  const isValid = isFormValid && !requireGitHubName;
  const SubmitButton = () => (
    <Button
      type="submit"
      kind={!isValid ? "disabled" : "primary"}
      loading={isSubmitting}
    >
      Submit
    </Button>
  );

  const handleChangeInvoiceDatasheet = useCallback(
    (value) => {
      setFieldValue("lineitems", value);
      !isEditing &&
        setSessionStorageInvoice({
          ...values,
          lineitems: value
        });
    },
    [setFieldValue, values, setSessionStorageInvoice, isEditing]
  );

  const handleFilesChange = useCallback(
    (v) => {
      const fs = files.concat(v);
      const errors = validateFiles(fs);
      if (errors && errors.files) {
        setFieldError("global", errors.files.join(" "));
      }
      setFieldValue("files", fs, false);
    },
    [setFieldValue, files, validateFiles, setFieldError]
  );

  const lineItemErrors = useMemo(
    () => improveLineItemErrors(errors.lineitems),
    [errors.lineitems]
  );

  const handleFileRemoval = useCallback(
    (v) => {
      const fs = files.filter((f) => f.payload !== v.payload);
      setFieldValue("files", fs);
    },
    [setFieldValue, files]
  );

  const handleChangeWithTouched = (field) => (e) => {
    setFieldTouched(field, true);
    !isEditing &&
      setSessionStorageInvoice({
        ...values,
        [field]: e.target.value
      });
    handleChange(e);
  };

  return (
    <form onSubmit={handleSubmit}>
      {errors && errors.global && (
        <Message kind="error" className="margin-bottom-m">
          {errors.global.toString()}
        </Message>
      )}
      {requireGitHubName && (
        <Message kind="warning" className="margin-bottom-m">
          Update your GitHub Username information on Account {">"} Manage
          Contractor to submit an Invoice
        </Message>
      )}
      <div className="justify-space-between">
        <MonthPickerField
          years={getInvoiceMinMaxYearAndMonth()}
          name="date"
          label="Reference month"
        />
        <ExchangeRateField name="exchangerate" />
      </div>
      <BoxTextInput
        placeholder="Contractor name"
        name="name"
        tabIndex={1}
        value={values.name}
        error={touched.name && errors.name}
        onChange={handleChangeWithTouched("name")}
      />
      <BoxTextInput
        placeholder="Contractor location"
        name="location"
        tabIndex={1}
        value={values.location}
        error={touched.location && errors.location}
        onChange={handleChangeWithTouched("location")}
      />
      <BoxTextInput
        placeholder="Contractor contact"
        name="contact"
        tabIndex={1}
        value={values.contact}
        error={touched.contact && errors.contact}
        onChange={handleChangeWithTouched("contact")}
      />
      <BoxTextInput
        placeholder="Payment address"
        name="address"
        tabIndex={1}
        value={values.address}
        error={touched.address && errors.address}
        onChange={handleChangeWithTouched("address")}
      />
      <BoxTextInput
        placeholder="Contractor rate"
        name="rate"
        type="number"
        tabIndex={1}
        value={values.rate}
        error={touched.rate && errors.rate}
        onChange={handleChangeWithTouched("rate")}
      />
      <AttachFileInput
        label="Attach files"
        type="button"
        onChange={handleFilesChange}
      />
      <ThumbnailGrid
        value={files}
        onClick={() => null}
        onRemove={handleFileRemoval}
        errorsPerFile={errors.files}
      />
      <InvoiceDatasheet
        value={values.lineitems}
        userRate={values.rate}
        errors={lineItemErrors}
        onChange={handleChangeInvoiceDatasheet}
        proposals={approvedProposals}
        proposalsError={approvedProposalsError}
      />
      <div className="justify-right">
        <DraftSaver submitSuccess={submitSuccess} />
        <SubmitButton />
      </div>
    </form>
  );
});

const InvoiceFormWrapper = ({
  initialValues,
  onSubmit,
  history,
  approvedProposals,
  approvedProposalsError,
  editMode
}) => {
  const { policy } = usePolicy();
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const { user, loading, requireGitHubName, onUpdateContractorInfo } =
    useContractor();

  const invoiceFormValidation = useMemo(
    () =>
      invoiceValidationSchema(policy, [
        ...approvedProposals.map((prop) => prop.censorshiprecord.token),
        ""
      ]),
    [policy, approvedProposals]
  );
  const validateFiles = useMemo(
    () => generateFilesValidatorByPolicy(policy),
    [policy]
  );
  const FORM_INITIAL_VALUES = {
    name: user ? user.contractorname : "",
    location: user ? user.contractorlocation : "",
    contact: user ? user.contractorcontact : "",
    address: "",
    exchangerate: "",
    rate: "",
    date: getInitialDateValue(),
    lineitems: [generateBlankLineItem(policy)],
    files: []
  };
  let formInitialValues = initialValues
    ? { ...FORM_INITIAL_VALUES, ...initialValues }
    : FORM_INITIAL_VALUES;
  const [sessionStorageInvoice, setSessionStorageInvoice] = useSessionStorage(
    "invoice",
    null
  );
  if (sessionStorageInvoice !== null) {
    formInitialValues = { ...FORM_INITIAL_VALUES, ...sessionStorageInvoice };
  }
  const isInitialValid = invoiceFormValidation.isValidSync(formInitialValues);

  const handleSubmit = useCallback(
    async (values, { resetForm, setSubmitting, setFieldError }) => {
      try {
        const {
          date: { month, year },
          ...others
        } = values;
        const token = await onSubmit({
          ...others,
          month,
          year
        });

        // Token from new invoice or from edit invoice
        const invoiceToken = token || values.token;
        setSubmitting(false);
        setSubmitSuccess(true);
        const userDetails = {
          githubname: user.githubname,
          matrixname: user.matrixname,
          contractorname: others.name,
          contractorlocation: others.location,
          contractorcontact: others.contact
        };
        onUpdateContractorInfo(userDetails);
        history.push(`/invoices/${invoiceToken}`);
        setSessionStorageInvoice(null);
        resetForm();
      } catch (e) {
        setSubmitting(false);
        setFieldError("global", e);
      }
    },
    [history, onSubmit, setSessionStorageInvoice, onUpdateContractorInfo, user]
  );
  return loading ? (
    <div className={styles.spinnerWrapper}>
      <Spinner invert />
    </div>
  ) : (
    <Formik
      onSubmit={handleSubmit}
      initialValues={formInitialValues}
      isInitialValid={isInitialValid}
      validationSchema={invoiceFormValidation}
    >
      {(props) => (
        <InvoiceForm
          {...{
            ...props,
            submitSuccess,
            setSessionStorageInvoice,
            approvedProposals,
            approvedProposalsError,
            validateFiles,
            requireGitHubName,
            isEditing: editMode
          }}
        />
      )}
    </Formik>
  );
};

InvoiceFormWrapper.propTypes = {
  approvedProposals: PropTypes.array.isRequired,
  initialValues: PropTypes.object,
  onSubmit: PropTypes.func,
  setSessionStorageInvoice: PropTypes.func,
  history: PropTypes.object,
  editMode: PropTypes.bool
};

export default withRouter(InvoiceFormWrapper);
