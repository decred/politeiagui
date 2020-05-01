import React from "react";
import MultipleContentPage from "../../components/layout/MultipleContentPage";
import PayoutsList from "src/containers/Invoice/Payouts";
import { AdminInvoiceActionsProvider } from "src/containers/Invoice/Actions";

const PageGeneratePayoutsList = () => {
  return (
    <MultipleContentPage disableScrollToTop topBannerHeight={90}>
      {(props) => (
        <AdminInvoiceActionsProvider>
          <PayoutsList {...props} />
        </AdminInvoiceActionsProvider>
      )}
    </MultipleContentPage>
  );
};

export default PageGeneratePayoutsList;
