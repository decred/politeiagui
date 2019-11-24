import React, { useCallback } from "react";
import { Button, classNames } from "pi-ui";
import { useAdminInvoiceActions } from "./hooks";
import AdminContent from "src/componentsv2/AdminContent";
import { isUnreviewedInvoice } from "../helpers";

const InvoiceActions = ({ invoice }) => {
  if (!useAdminInvoiceActions()) {
    throw Error(
      "Admin invoices actions requires an 'AdminActionsProvider' on a higher level of the component tree. "
    );
  }

  const { onApprove, onReject, onDispute } = useAdminInvoiceActions();

  const withInvoice = useCallback(
    fn => () => {
      fn(invoice);
    },
    [invoice]
  );

  return (
    isUnreviewedInvoice(invoice) && (
      <AdminContent>
        <div className="justify-right margin-top-m">
          <Button
            onClick={withInvoice(onReject)}
            className={classNames("margin-right-s")}
            noBorder
            kind="secondary"
          >
            Reject
          </Button>
          <Button
            onClick={withInvoice(onDispute)}
            className={classNames("margin-right-s")}
            noBorder
            kind="secondary"
          >
            Dispute
          </Button>
          <Button onClick={withInvoice(onApprove)}>Approve</Button>
        </div>
      </AdminContent>
    )
  );
};

export default InvoiceActions;
