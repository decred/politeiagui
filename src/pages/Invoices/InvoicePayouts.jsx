import React from "react";
import MultipleContentPage from "../../components/layout/MultipleContentPage";
import PayoutSummaries from "src/containers/Invoice/PayoutSummaries/PayoutSummaries";
import { AdminInvoiceActionsProvider } from "src/containers/Invoice/Actions";

const PageInvoicePayouts = () => {
  return (
    <MultipleContentPage
      disableScrollToTop
      topBannerHeight={140}
    >
      {props =>
        <AdminInvoiceActionsProvider>
          <PayoutSummaries {...props} />
        </AdminInvoiceActionsProvider>
      }
    </MultipleContentPage>
  );
};

export default PageInvoicePayouts;
