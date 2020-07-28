import React from "react";
import MultipleContentPage from "../../components/layout/MultipleContentPage";
import BillingSummary from "src/containers/Invoice/ProposalBillingSummary";
import { AdminInvoiceActionsProvider } from "src/containers/Invoice/Actions";

const ProposalsBillingSummary = () => {
  return (
    <MultipleContentPage disableScrollToTop topBannerHeight={140}>
      {(props) => (
        <AdminInvoiceActionsProvider>
          <BillingSummary {...props} />
        </AdminInvoiceActionsProvider>
      )}
    </MultipleContentPage>
  );
};

export default ProposalsBillingSummary;
