import React from "react";
import { Card } from "pi-ui";
import InvoiceForm from "src/components/InvoiceForm";
import { useNewInvoice } from "./hooks";
import useApprovedProposals from "src/hooks/api/useApprovedProposals";
import usePolicy from "src/hooks/api/usePolicy";

const NewInvoice = () => {
  const {
    policyTicketVote: { summariespagesize: proposalPageSize }
  } = usePolicy();
  const { onSubmitInvoice } = useNewInvoice();
  const { proposalsNotRFP: proposals, error } =
    useApprovedProposals(proposalPageSize);

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
