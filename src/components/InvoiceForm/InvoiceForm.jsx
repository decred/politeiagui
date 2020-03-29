import React, { useMemo, useState, useCallback, useEffect } from "react";
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
import useUserDetail from "src/hooks/api/useUserDetail";
import { invoiceValidationSchema, improveLineItemErrors } from "./validation";
import DraftSaver from "./DraftSaver";
import ThumbnailGrid from "src/components/Files";
import ExchangeRateField from "./ExchangeRateField";
import useSessionStorage from "src/hooks/utils/useSessionStorage";
import { useAction } from "src/redux";
import { onEditUser } from "src/actions";
import styles from "./InvoiceForm.module.css";

const InvoiceForm = React.memo(function InvoiceForm({
  values,
  handleChange,
  handleSubmit,
  isSubmitting,
  setFieldValue,
  setFieldTouched,
  errors,
  touched,
  isValid,
  submitSuccess,
  setSessionStorageInvoice,
  approvedProposalsTokens
}) {
  // scroll to top in case of global error
  useEffect(() => {
    if (errors.global) {
      window.scrollTo(0, 0);
    }
  }, [errors]);

  const SubmitButton = () => (
    <Button
      type="submit"
      kind={!isValid ? "disabled" : "primary"}
      loading={isSubmitting}>
      Submit
    </Button>
  );

  const handleChangeInvoiceDatasheet = useCallback(
    (value) => {
      setFieldValue("lineitems", value);
      setSessionStorageInvoice({
        ...values,
        lineitems: value
      });
    },
    [setFieldValue, values, setSessionStorageInvoice]
  );

  const handleFilesChange = useCallback(
    (v) => {
      const files = values.files.concat(v);
      setFieldValue("files", files);
    },
    [setFieldValue, values.files]
  );

  const lineItemErrors = useMemo(
    () => improveLineItemErrors(errors.lineitems),
    [errors.lineitems]
  );

  const handleFileRemoval = useCallback(
    (v) => {
      const fs = values.files.filter((f) => f.payload !== v.payload);
      setFieldValue("files", fs);
    },
    [setFieldValue, values.files]
  );

  const handleChangeWithTouched = (field) => (e) => {
    setFieldTouched(field, true);
    setSessionStorageInvoice({
      ...values,
      [field]: e.target.value
    });
    handleChange(e);
  };

  return (
    <form onSubmit={handleSubmit}>
      {errors && errors.global && (
        <Message kind="error">{errors.global.toString()}</Message>
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
        value={values.files}
        onClick={() => null}
        onRemove={handleFileRemoval}
        errorsPerFile={errors.files}
      />
      <InvoiceDatasheet
        value={values.lineitems}
        userRate={values.rate}
        errors={lineItemErrors}
        onChange={handleChangeInvoiceDatasheet}
        proposalsTokens={approvedProposalsTokens}
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
  approvedProposalsTokens
}) => {
  const { policy } = usePolicy();
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const { user, loading } = useUserDetail();
  const onUpdateUser = useAction(onEditUser);
  const invoiceFormValidation = useMemo(() => invoiceValidationSchema(policy), [
    policy
  ]);
  const FORM_INITIAL_VALUES = {
    name: user.contractorname,
    location: user.contractorlocation,
    contact: user.contractorcontact,
    address: "",
    exchangerate: "",
    date: getInitialDateValue(),
    lineitems: [generateBlankLineItem(policy)],
    files: []
  };
  let formInitialValues = initialValues || FORM_INITIAL_VALUES;
  const [sessionStorageInvoice, setSessionStorageInvoice] = useSessionStorage(
    "invoice",
    null
  );
  if (sessionStorageInvoice !== null) {
    formInitialValues = sessionStorageInvoice;
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
          githubname: "",
          matrixname: "",
          contractorname: others.name,
          contractorlocation: others.location,
          contractorcontact: others.contact
        };
        onUpdateUser(userDetails);
        history.push(`/invoices/${invoiceToken}`);
        setSessionStorageInvoice(null);
        resetForm();
      } catch (e) {
        setSubmitting(false);
        setFieldError("global", e);
      }
    },
    [history, onSubmit, setSessionStorageInvoice, onUpdateUser]
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
      validationSchema={invoiceFormValidation}>
      {(props) => (
        <InvoiceForm
          {...{
            ...props,
            submitSuccess,
            setSessionStorageInvoice,
            approvedProposalsTokens
          }}
        />
      )}
    </Formik>
  );
};

InvoiceFormWrapper.propTypes = {
  approvedProposalsTokens: PropTypes.array.isRequired,
  initialValues: PropTypes.object,
  onSubmit: PropTypes.func,
  setSessionStorageInvoice: PropTypes.func,
  history: PropTypes.object
};

export default withRouter(InvoiceFormWrapper);
