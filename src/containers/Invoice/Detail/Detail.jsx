import React, { useMemo } from "react";
import { withRouter } from "react-router-dom";
import get from "lodash/fp/get";
import { useInvoice } from "./hooks";
import Invoice from "src/components/Invoice";
import InvoiceLoader from "src/components/Invoice/InvoiceLoader";
import { AdminInvoiceActionsProvider } from "src/containers/Invoice/Actions";
import Comments from "src/containers/Comments";
import { isUnreviewedInvoice, getProposalsTokensFromInvoice } from "../helpers";
import { GoBackLink } from "src/components/Router";
import useApprovedProposals from "src/hooks/api/useApprovedProposals";

const InvoiceDetail = ({ Main, match }) => {
  const invoiceToken = get("params.token", match);
  const threadParentCommentID = get("params.commentid", match);
  const { invoice, loading } = useInvoice(invoiceToken);
  const tokens = useMemo(() => getProposalsTokensFromInvoice(invoice), [
    invoice
  ]);

  const { proposals } = useApprovedProposals(tokens);

  return (
    <>
      <Main fillScreen>
        <GoBackLink />
        <AdminInvoiceActionsProvider>
          {!!invoice && !loading ? (
            <Invoice
              invoice={invoice}
              extended
              approvedProposals={proposals || []}
            />
          ) : (
            <InvoiceLoader extended />
          )}
          <Comments
            recordAuthorID={invoice && invoice.userid}
            recordToken={invoiceToken}
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
