import React from "react";
import Field, { FieldSeparator } from "./DescriptiveField";
import InvoiceDatasheet, { convertLineItemsToGrid } from "./InvoiceDatasheet";

const InvoiceContent = ({
  contractorcontact,
  contractorlocation,
  contractorname,
  contractorrate,
  lineItems,
  month,
  paymentaddress,
  year,
  expanded = true
}) => {
  return !expanded ? null : (
    <>
      <div style={{ padding: "5px", marginTop: "20px" }}>
        <Field label="Invoice month">{`${month}/${year}`}</Field>
        <FieldSeparator />
        <Field label="Contractor name">{contractorname}</Field>
        <FieldSeparator />
        <Field label="Contractor contact">{contractorcontact}</Field>
        <FieldSeparator />
        <Field label="Contractor location">{contractorlocation}</Field>
        <FieldSeparator />
        <Field label="Contractor rate">{contractorrate}</Field>
        <FieldSeparator />
        <Field label="Payment address">{paymentaddress}</Field>
      </div>
      <InvoiceDatasheet readOnly value={convertLineItemsToGrid(lineItems)} />
    </>
  );
};

export default InvoiceContent;
