import React from "react";
import { Card } from "pi-ui";
import InvoiceForm from "src/components/InvoiceForm";
import { useNewInvoice } from "./hooks";
import useApprovedProposals from "src/hooks/api/useApprovedProposals";

const NewInvoice = () => {
  const { onSubmitInvoice } = useNewInvoice();
  const { proposals, error } = useApprovedProposals();

  return (
    <Card className="container margin-bottom-l">
      <InvoiceForm
        onSubmit={onSubmitInvoice}
        approvedProposals={proposals}
        proposalsError={error}
      />
    </Card>
  );
};

export default NewInvoice;
