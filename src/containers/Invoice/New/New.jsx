import React from "react";
import { Card } from "pi-ui";
import InvoiceForm from "src/components/InvoiceForm";
import { useNewInvoice, useApprovedProposalsTokens } from "./hooks";

const NewInvoice = () => {
  const { onSubmitInvoice } = useNewInvoice();
  const approvedTokens = useApprovedProposalsTokens();
  return (
    <Card className="container margin-bottom-l">
      <InvoiceForm
        onSubmit={onSubmitInvoice}
        approvedProposalsTokens={approvedTokens}
      />
    </Card>
  );
};

export default NewInvoice;
