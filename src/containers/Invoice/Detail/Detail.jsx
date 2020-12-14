import React from "react";
import { withRouter } from "react-router-dom";
import { Message } from "pi-ui";
import { useInvoice } from "./hooks";
import Invoice from "src/components/Invoice";
import InvoiceLoader from "src/components/Invoice/InvoiceLoader";
import { AdminInvoiceActionsProvider } from "src/containers/Invoice/Actions";
import Comments from "src/containers/Comments";
import { isUnreviewedInvoice } from "../helpers";
import { GoBackLink } from "src/components/Router";
import Stats from "./Stats";
import get from "lodash/fp/get";
import { useDocumentTitle } from "src/hooks/utils/useDocumentTitle";
import { presentationalInvoiceName } from "../helpers";

const InvoiceDetail = ({ Main, match }) => {
  const invoiceToken = get("params.token", match);
  const threadParentCommentID = get("params.commentid", match);

  const {
    invoice,
    loading,
    currentUser,
    error,
    proposals,
    proposalsError
  } = useInvoice(invoiceToken);

  const isAuthor =
    currentUser && invoice && invoice.userid === currentUser.userid;
  const isAdmin = currentUser && currentUser.isadmin;
  const isPublicMode = !isAdmin && !isAuthor;

  // set tab title
  useDocumentTitle(presentationalInvoiceName(invoice));

  return (
    <>
      <Main fillScreen>
        <GoBackLink />
        <AdminInvoiceActionsProvider>
          {error ? (
            <Message kind="error">{error.toString()}</Message>
          ) : !!invoice && !loading ? (
            <>
              <Invoice
                invoice={invoice}
                isAuthor={isAuthor}
                isPublicMode={isPublicMode}
                extended
                approvedProposals={proposals || []}
                approvedProposalsError={proposalsError}
              />
              {isAdmin && (
                <Stats
                  invoiceToken={invoice.censorshiprecord.token}
                  userid={invoice.userid}
                />
              )}
            </>
          ) : (
            <InvoiceLoader extended />
          )}
          {!isPublicMode && (
            <Comments
              recordAuthorID={invoice && invoice.userid}
              recordToken={invoiceToken}
              threadParentID={threadParentCommentID}
              readOnly={invoice && !isUnreviewedInvoice(invoice)}
              readOnlyReason={
                "This invoice can no longer receive comments due its current status."
              }
            />
          )}
        </AdminInvoiceActionsProvider>
      </Main>
    </>
  );
};

export default withRouter(InvoiceDetail);
