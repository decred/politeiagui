import React from "react";
import { withRouter } from "react-router-dom";
import get from "lodash/fp/get";
import { useInvoice } from "./hooks";
import Invoice from "src/componentsv2/Invoice";
import { AdminInvoiceActionsProvider } from "src/containers/Invoice/Actions";

const InvoiceDetail = ({ Main, match }) => {
  const invoiceToken = get("params.token", match);

  const { invoice, loading } = useInvoice(invoiceToken);

  return (
    <>
      <Main fillScreen>
        <AdminInvoiceActionsProvider>
          {!!invoice && <Invoice invoice={invoice} extended />}
        </AdminInvoiceActionsProvider>
      </Main>
    </>
  );
};

export default withRouter(InvoiceDetail);
