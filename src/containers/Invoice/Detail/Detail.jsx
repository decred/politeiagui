import React from "react";
import { withRouter } from "react-router-dom";
import get from "lodash/fp/get";
import { useInvoice } from "./hooks";
import Invoice from "src/componentsv2/Invoice";
import { AdminInvoiceActionsProvider } from "src/containers/Invoice/Actions";
import Comments from "src/containers/Comments";

const InvoiceDetail = ({ Main, match }) => {
  const invoiceToken = get("params.token", match);
  const threadParentCommentID = get("params.commentid", match);

  const { invoice, loading } = useInvoice(invoiceToken);

  return (
    <>
      <Main fillScreen>
        <AdminInvoiceActionsProvider>
          {!!invoice && <Invoice invoice={invoice} extended />}
          <Comments
            recordAuthorID={invoice && invoice.userid}
            recordToken={invoiceToken}
            numOfComments={1}
            threadParentID={threadParentCommentID}
            readOnly={false}
            // readOnlyReason={getCommentBlockedReason(proposal, voteSummary)}
          />
        </AdminInvoiceActionsProvider>
      </Main>
    </>
  );
};

export default withRouter(InvoiceDetail);
