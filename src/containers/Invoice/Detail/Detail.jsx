import React, { useEffect, useMemo } from "react";
import { withRouter } from "react-router-dom";
import get from "lodash/fp/get";
import { useInvoice } from "./hooks";
import Invoice from "src/components/Invoice";
import InvoiceLoader from "src/components/Invoice/InvoiceLoader";
import { AdminInvoiceActionsProvider } from "src/containers/Invoice/Actions";
import Comments from "src/containers/Comments";
import { isUnreviewedInvoice } from "../helpers";
import { GoBackLink } from "src/components/Router";
import useApprovedProposals from "src/hooks/api/useApprovedProposals";
import isEmpty from "lodash/isEmpty";
import flow from "lodash/fp/flow";
import map from "lodash/fp/map";
import filter from "lodash/fp/filter";
import uniq from "lodash/fp/uniq";

const PAGE_SIZE = 20;

const InvoiceDetail = ({ Main, match }) => {
  const invoiceToken = get("params.token", match);
  const threadParentCommentID = get("params.commentid", match);
  const { invoice, loading } = useInvoice(invoiceToken);
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
    isLoading
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
