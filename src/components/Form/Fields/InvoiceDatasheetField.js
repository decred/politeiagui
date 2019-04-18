import React from "react";
import InvoiceDatasheet from "../../InvoiceDatasheet";

const InvoiceDatasheetField = ({
  input: { onChange, value = [] },
  ...props
}) => {
  if (typeof value == "string") {
    value = [];
  }
  return <InvoiceDatasheet onChange={onChange} value={value} {...props} />;
};

export default InvoiceDatasheetField;
