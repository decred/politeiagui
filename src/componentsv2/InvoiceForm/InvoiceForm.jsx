import React from "react";
import { BoxTextInput, Button } from "pi-ui";
import { Formik } from "formik";
import InvoiceDatasheet, {
  generateBlankLineItem
} from "src/componentsv2/InvoiceDatasheet";

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
        lineitems: [generateBlankLineItem()]
      }}
    >
      {({ handleChange, values, handleSubmit, errors, setFieldValue }) => {
        return (
          <form onSubmit={handleSubmit}>
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
