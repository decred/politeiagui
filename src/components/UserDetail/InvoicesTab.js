import React from "react";
import userConnector from "../../connectors/user";
import { Content as InvoiceListing } from "../../components/snew";

const InvoicesTab = ({
  user,
  loggedInAsEmail,
  isAdmin,
  onFetchUserInvoices,
  count,
  getSubmittedUserInvoices,
  isLoadingProposals
}) => {
  return (
    <InvoiceListing
      isLoading={isLoadingProposals}
      loggedInAsEmail={loggedInAsEmail}
      isAdmin={isAdmin}
      count={count}
      userid={user.id}
      invoices={getSubmittedUserInvoices}
      onFetchUserInvoices={onFetchUserInvoices}
      emptyProposalsMessage={"This user has not submitted any invoices"}
    />
  );
};

export default userConnector(InvoicesTab);
