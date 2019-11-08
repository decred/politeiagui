import React from "react";
import { Card } from "pi-ui";
import InvoiceForm from "src/componentsv2/InvoiceForm";

const NewInvoiceForm = () => {
  return (
    <Card className="container margin-bottom-l">
      <InvoiceForm />
    </Card>
  );
};

export default NewInvoiceForm;
