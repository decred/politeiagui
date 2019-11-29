import React from "react";
import { withRouter } from "react-router-dom";
import get from "lodash/fp/get";
import { useInvoice } from "./hooks";
import Invoice from "src/componentsv2/Invoice";
import InvoiceLoader from "src/componentsv2/Invoice/InvoiceLoader";
import { AdminInvoiceActionsProvider } from "src/containers/Invoice/Actions";
import Comments from "src/containers/Comments";
import { isUnreviewedInvoice } from "../helpers";

const InvoiceDetail = ({ Main, match }) => {
  const invoiceToken = get("params.token", match);
  const threadParentCommentID = get("params.commentid", match);

  const { invoice, loading } = useInvoice(invoiceToken);

  return (
    <>
      <Main fillScreen>
        <AdminInvoiceActionsProvider>
          {!!invoice && !loading ? (
            <Invoice invoice={invoice} extended />
          ) : (
            <InvoiceLoader extended />
          )}
          <Comments
            recordAuthorID={invoice && invoice.userid}
            recordToken={invoiceToken}
            numOfComments={1}
            threadParentID={threadParentCommentID}
            readOnly={invoice && !isUnreviewedInvoice(invoice)}
            readOnlyReason={
              "This invoice can no longer receive comments due its current status."
            }
          />
        </AdminInvoiceActionsProvider>
      </Main>
    </>
  );
};

export default withRouter(InvoiceDetail);
