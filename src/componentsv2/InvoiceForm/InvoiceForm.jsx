import React, { useEffect, useMemo } from "react";
import { BoxTextInput, Button, Spinner, Text } from "pi-ui";
import { Formik } from "formik";
import InvoiceDatasheet, {
  generateBlankLineItem
} from "src/componentsv2/InvoiceDatasheet";
import MonthPickerField from "../MonthPicker/MonthPickerField";
import useExchangeRate from "src/hooks/api/useExchangeRate";
import usePolicy from "src/hooks/api/usePolicy";
import { getCurrentMonth, getCurrentYear } from "src/helpers";
import { invoiceValidationSchema, improveLineItemErrors } from "./validation";

const ExchangeRate = ({ month, year, setFieldValue }) => {
  const [rate, loading] = useExchangeRate(month, year);

  useEffect(() => {
    setFieldValue(rate);
  }, [rate, setFieldValue]);
  return (
    <div style={{ display: "grid" }}>
      <Text color="gray">Exchange rate</Text>
      {loading ? <Spinner invert /> : <Text>${rate / 100}</Text>}
    </div>
  );
};

const getInitialDateValue = () => {
  const currYear = getCurrentYear();
  const currMonth = getCurrentMonth();

  // case is december
  if (currMonth === 1) {
    return {
      year: currYear - 1,
      month: 12
    };
  }

  return {
    year: currYear,
    month: currMonth - 1
  };
};

const getMinMaxYearAndMonth = () => {
  const min = { year: 2018, month: 1 };
  return {
    min,
    max: getInitialDateValue()
  };
};
const InvoiceForm = () => {
  const { policy } = usePolicy();

  const validationSchema = useMemo(() => invoiceValidationSchema(policy), [
    policy
  ]);

  return (
    <Formik
      onSubmit={values => console.log("submit", values)}
      initialValues={{
        name: "",
        location: "",
        contact: "",
        rate: "",
        address: "",
        date: getInitialDateValue(),
        lineitems: [generateBlankLineItem()]
      }}
      validationSchema={validationSchema}
    >
      {({
        handleChange,
        handleBlur,
        values,
        handleSubmit,
        errors,
        setFieldValue,
        isValid,
        touched
      }) => {
        const lineItemErrors = improveLineItemErrors(errors.lineitems);
        return (
          <form onSubmit={handleSubmit}>
            <div className="justify-space-between">
              <MonthPickerField
                years={getMinMaxYearAndMonth()}
                name="date"
                label="Reference month"
              />
              <ExchangeRate {...values.date} setFieldValue={setFieldValue} />
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
              placeholder="Contractor rate"
              name="rate"
              type="number"
              tabIndex={1}
              value={values.rate}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.rate && errors.rate}
            />
            <InvoiceDatasheet
              value={values.lineitems}
              userRate={values.rate}
              errors={lineItemErrors}
              onChange={v => setFieldValue("lineitems", v)}
            />
            <div className="justify-right">
              <Button kind={isValid ? "primary" : "disabled"} type="submit">
                Submit
              </Button>
            </div>
          </form>
        );
      }}
    </Formik>
  );
};

export default InvoiceForm;
