import React, { useEffect, useMemo } from "react";
import { withRouter } from "react-router-dom";
import { Message } from "pi-ui";
import { useInvoice } from "./hooks";
import Invoice from "src/components/Invoice";
import InvoiceLoader from "src/components/Invoice/InvoiceLoader";
import { AdminInvoiceActionsProvider } from "src/containers/Invoice/Actions";
import Comments from "src/containers/Comments";
import { isUnreviewedInvoice } from "../helpers";
import { GoBackLink } from "src/components/Router";
import useApprovedProposals from "src/hooks/api/useApprovedProposals";
import get from "lodash/fp/get";
import isEmpty from "lodash/isEmpty";
import flow from "lodash/fp/flow";
import map from "lodash/fp/map";
import filter from "lodash/fp/filter";
import uniq from "lodash/fp/uniq";

const PAGE_SIZE = 20;

const InvoiceDetail = ({ Main, match }) => {
  const invoiceToken = get("params.token", match);
  const threadParentCommentID = get("params.commentid", match);
  const { invoice, loading, currentUser } = useInvoice(invoiceToken);
  const isAuthor =
    currentUser && invoice && invoice.userid === currentUser.userid;
  const isAdmin = currentUser && currentUser.isadmin;
  const isPublicMode = !isAdmin && !isAuthor;
  const tokens = useMemo(
    () =>
      invoice &&
      invoice.input &&
      invoice.input.lineitems &&
      flow(
        map(({ proposaltoken }) => proposaltoken),
        uniq,
        filter((t) => t !== "")
      )(invoice.input.lineitems),
    [invoice]
  );

  const {
    proposals,
    proposalsByToken,
    onFetchProposalsBatchByTokensRemaining,
    isLoading,
    error: proposalsError
  } = useApprovedProposals();

  useEffect(() => {
    if (!isLoading && !isEmpty(proposalsByToken)) {
      const remainingTokens = tokens
        ? tokens.filter(
            (t) => !Object.keys(proposalsByToken).some((pt) => pt === t)
          )
        : [];
      if (!isEmpty(remainingTokens)) {
        onFetchProposalsBatchByTokensRemaining(remainingTokens, PAGE_SIZE);
      }
    }
  }, [
    isLoading,
    proposalsByToken,
    tokens,
    onFetchProposalsBatchByTokensRemaining
  ]);

  return (
    <>
      <Main fillScreen>
        <GoBackLink />
        <AdminInvoiceActionsProvider>
          {error ? (
            <Message kind="error">{error.toString()}</Message>
          ) : !!invoice && !loading ? (
            <Invoice
              invoice={invoice}
              isPublicMode={isPublicMode}
              extended
              approvedProposals={proposals || []}
              approvedProposalsError={proposalsError}
            />
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
