import React from "react";
import InvoiceDatasheet from "../../InvoiceDatasheet";

const InvoiceDatasheetField = ({ input: { onChange, value }, ...props }) => (
  <InvoiceDatasheet onChange={onChange} value={value} {...props} />
);

export default InvoiceDatasheetField;
