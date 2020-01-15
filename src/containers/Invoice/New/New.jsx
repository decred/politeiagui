import React from "react";
import { Card } from "pi-ui";
import InvoiceForm from "src/componentsv2/InvoiceForm";
import { useNewInvoice } from "./hooks";

const NewInvoiceForm = () => {
  const { onSubmitInvoice } = useNewInvoice();
  return (
    <Card className="container margin-bottom-l">
      <InvoiceForm onSubmit={onSubmitInvoice} />
    </Card>
  );
};

export default NewInvoiceForm;
