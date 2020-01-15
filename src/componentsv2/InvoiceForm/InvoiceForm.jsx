import React, { useMemo, useState, useCallback, useEffect } from "react";
import { BoxTextInput, Button, Message } from "pi-ui";
import { Formik } from "formik";
import { withRouter } from "react-router-dom";
import InvoiceDatasheet, {
  generateBlankLineItem
} from "src/componentsv2/InvoiceDatasheet";
import MonthPickerField from "../MonthPicker/MonthPickerField";
import AttachFileInput from "src/componentsv2/AttachFileInput";
import usePolicy from "src/hooks/api/usePolicy";
import {
  getInitialDateValue,
  getMinMaxYearAndMonth
} from "src/containers/Invoice";
import { invoiceValidationSchema, improveLineItemErrors } from "./validation";
import ThumbnailGrid from "src/componentsv2/Files";
import ExchangeRateField from "./ExchangeRateField";

const InvoiceForm = React.memo(function InvoiceForm({
  values,
  handleChange,
  handleSubmit,
  handleBlur,
  isSubmitting,
  setFieldValue,
  errors,
  touched,
  isValid
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

  return (
    <form onSubmit={handleSubmit}>
      {errors && errors.global && (
        <Message kind="error">{errors.global.toString()}</Message>
      )}
      <div className="justify-space-between">
        <MonthPickerField
          years={getMinMaxYearAndMonth()}
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
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.name && errors.name}
      />
      <BoxTextInput
        placeholder="Contractor location"
        name="location"
        tabIndex={1}
        value={values.location}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.location && errors.location}
      />
      <BoxTextInput
        placeholder="Contractor contact"
        name="contact"
        tabIndex={1}
        value={values.contact}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.contact && errors.contact}
      />
      <BoxTextInput
        placeholder="Payment address"
        name="address"
        tabIndex={1}
        value={values.address}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.contact && errors.address}
      />
      <BoxTextInput
        placeholder="Contractor rate"
        name="rate"
        type="number"
        tabIndex={1}
        value={values.rate}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.rate && errors.rate}
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
        // errors={errors}
      />

      <InvoiceDatasheet
        value={values.lineitems}
        userRate={values.rate}
        errors={lineItemErrors}
        onChange={handleChangeInvoiceDatasheet}
      />
      <div className="justify-right">
        <SubmitButton />
      </div>
    </form>
  );
});

const InvoiceFormWrapper = ({ initialValues, onSubmit, history }) => {
  const { policy } = usePolicy();
  const [, setSubmitSuccess] = useState(false);
  const validationSchema = useMemo(() => invoiceValidationSchema(policy), [
    policy
  ]);

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
        history.push(`/invoices/${invoiceToken}`);
        resetForm();
      } catch (e) {
        setSubmitting(false);
        setFieldError("global", e);
      }
    },
    [history, onSubmit]
  );

  return (
    <Formik
      onSubmit={handleSubmit}
      initialValues={ initialValues || {
        name: "",
        location: "",
        contact: "",
        address: "",
        exchangerate: "",
        date: getInitialDateValue(),
        lineitems: [generateBlankLineItem()],
        files: []
      }}
      validationSchema={validationSchema}>
      {(props) => {
        return <InvoiceForm {...props} />;
      }}
    </Formik>
  );
};

export default withRouter(InvoiceFormWrapper);
