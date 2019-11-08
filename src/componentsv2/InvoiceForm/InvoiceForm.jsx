import React, { useEffect } from "react";
import { BoxTextInput, Button, Spinner, Text } from "pi-ui";
import { Formik } from "formik";
import InvoiceDatasheet, {
  generateBlankLineItem
} from "src/componentsv2/InvoiceDatasheet";
import MonthPickerField from "../MonthPicker/MonthPickerField";
import useExchangeRate from "src/hooks/api/useExchangeRate";
import { getCurrentMonth, getCurrentYear } from "src/helpers";

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
    >
      {({ handleChange, values, handleSubmit, errors, setFieldValue }) => {
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
              error={errors.name}
            />
            <BoxTextInput
              placeholder="Contractor location"
              name="location"
              tabIndex={1}
              value={values.location}
              onChange={handleChange}
              error={errors.location}
            />
            <BoxTextInput
              placeholder="Contractor contact"
              name="contact"
              tabIndex={1}
              value={values.contact}
              onChange={handleChange}
              error={errors.contact}
            />
            <BoxTextInput
              placeholder="Contractor rate"
              name="rate"
              type="number"
              tabIndex={1}
              value={values.rate}
              onChange={handleChange}
              error={errors.rate}
            />
            <InvoiceDatasheet
              value={values.lineitems}
              userRate={values.rate}
              onChange={v => setFieldValue("lineitems", v)}
            />
            <div className="justify-right">
              <Button type="submit">Submit</Button>
            </div>
          </form>
        );
      }}
    </Formik>
  );
};

export default InvoiceForm;
