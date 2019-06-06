import React from "react";
import Field, { FieldSeparator } from "./DescriptiveField";
import InvoiceDatasheet from "./InvoiceDatasheet";
import { fromUSDCentsToUSDUnits } from "../helpers";
import { lineitemsWithSubtotal } from "../components/InvoiceDatasheet/helpers";

const InvoiceContent = ({
  contractorcontact,
  contractorlocation,
  contractorname,
  contractorrate,
  lineitems,
  month,
  paymentaddress,
  year,
  exchangerate,
  expanded = true
}) => {
  return !expanded ? null : (
    <>
      <div style={{ padding: "5px", marginTop: "20px" }}>
        <Field label="Invoice month">{`${month}/${year}`}</Field>
        <FieldSeparator />
        <Field label="Exchange rate">
          {`${fromUSDCentsToUSDUnits(exchangerate)} USD`}
        </Field>
        <FieldSeparator />
        <Field label="Contractor name">{contractorname}</Field>
        <FieldSeparator />
        <Field label="Contractor contact">{contractorcontact}</Field>
        <FieldSeparator />
        <Field label="Contractor location">{contractorlocation}</Field>
        <FieldSeparator />
        <Field label="Contractor rate">
          {`${fromUSDCentsToUSDUnits(contractorrate)} USD`}
        </Field>
        <FieldSeparator />
        <Field label="Payment address">{paymentaddress}</Field>
      </div>
      <InvoiceDatasheet
        readOnly
        value={lineitemsWithSubtotal(lineitems, contractorrate)}
      />
    </>
  );
};

export default InvoiceContent;
