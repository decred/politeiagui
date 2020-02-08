import React, { useEffect, useMemo } from "react";
import { Card } from "pi-ui";
import InvoiceForm from "src/componentsv2/InvoiceForm";
import { useNewInvoice } from "./hooks";

const NewInvoice = () => {
  const { onSubmitInvoice, onFetchTokenInventory, proposalsTokens } = useNewInvoice();
  //TODO: changed rejected => approved
  const approvedProposalsTokens = useMemo(() => proposalsTokens && proposalsTokens.rejected, [proposalsTokens]);

  useEffect(() => {
    onFetchTokenInventory();
  }, [onFetchTokenInventory]);

  return (
    <Card className="container margin-bottom-l">
      <InvoiceForm onSubmit={onSubmitInvoice} approvedProposalsTokens={approvedProposalsTokens} />
    </Card>
  );
};

export default NewInvoice;
