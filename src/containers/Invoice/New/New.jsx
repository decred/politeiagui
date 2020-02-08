import React from "react";
import { Card } from "pi-ui";
import InvoiceForm from "src/componentsv2/InvoiceForm";
import { useNewInvoice } from "./hooks";

const NewInvoice = () => {
  const { onSubmitInvoice, approvedProposalsTokens } = useNewInvoice();

  return (
    <Card className="container margin-bottom-l">
      <InvoiceForm onSubmit={onSubmitInvoice} approvedProposalsTokens={approvedProposalsTokens || []} />
    </Card>
  );
};

export default NewInvoice;
