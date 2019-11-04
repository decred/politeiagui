import React from "react";
import { Card } from "pi-ui";
import InvoiceForm from "src/componentsv2/InvoiceForm";

const NewInvoiceForm = () => {
  return (
    <Card className="container">
      <InvoiceForm />
    </Card>
  );
};

export default NewInvoiceForm;
