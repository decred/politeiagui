import React from "react";
import MultipleContentPage from "../../components/layout/MultipleContentPage";
import ProposalBillingDetails from "src/containers/Invoice/ProposalBillingDetails";
import { AdminInvoiceActionsProvider } from "src/containers/Invoice/Actions";

const ProposalsBilling = () => {
  return (
    <MultipleContentPage disableScrollToTop topBannerHeight={140}>
      {(props) => (
        <AdminInvoiceActionsProvider>
          <ProposalBillingDetails {...props} />
        </AdminInvoiceActionsProvider>
      )}
    </MultipleContentPage>
  );
};

export default ProposalsBilling;
