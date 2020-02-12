import React from "react";
import { Card } from "pi-ui";
import InvoiceForm from "src/componentsv2/InvoiceForm";
import { useNewInvoice, useApprovedProposalsTokens } from "./hooks";

const NewInvoice = () => {
  const { onSubmitInvoice } = useNewInvoice();
  const approvedProposalsTokens = useApprovedProposalsTokens();

  return (
    <Card className="container margin-bottom-l">
      <InvoiceForm
        onSubmit={onSubmitInvoice}
        approvedProposalsTokens={approvedProposalsTokens || []}
      />
    </Card>
  );
};

export default NewInvoice;
