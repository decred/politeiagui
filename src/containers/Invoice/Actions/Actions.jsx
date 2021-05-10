import React, { useCallback } from "react";
import {
  Button,
  classNames,
  useMediaQuery,
  Dropdown,
  DropdownItem
} from "pi-ui";
import Link from "src/components/Link";
import { useAdminInvoiceActions } from "./hooks";
import AdminContent from "src/components/AdminContent";
import { isUnreviewedInvoice, presentationalInvoiceName } from "../helpers";

const InvoiceActions = ({ invoice, extended }) => {
  if (!useAdminInvoiceActions()) {
    throw Error(
      "Admin invoices actions requires an 'AdminActionsProvider' on a higher level of the component tree. "
    );
  }
  const mobile = useMediaQuery("(max-width: 560px)");
  const { onApprove, onReject, onDispute, nextInvoice } =
    useAdminInvoiceActions();
  const withInvoice = useCallback(
    (fn) => () => {
      fn(invoice);
    },
    [invoice]
  );

  const approveButton = (
    <Button onClick={withInvoice(onApprove)}>Approve</Button>
  );
  const rejectButton = (
    <Button
      onClick={withInvoice(onReject)}
      className={classNames("margin-right-s")}
      noBorder
      kind="secondary">
      Reject
    </Button>
  );
  const disputeButton = (
    <Button
      onClick={withInvoice(onDispute)}
      className={classNames("margin-right-s")}
      noBorder
      kind="secondary">
      Dispute
    </Button>
  );
  return isUnreviewedInvoice(invoice) ? (
    <AdminContent>
      <div className="justify-right margin-top-m">
        {!mobile ? (
          <>
            {rejectButton}
            {disputeButton}
            {approveButton}
          </>
        ) : (
          <Dropdown title="Actions" className="margin-right-l">
            <DropdownItem>{approveButton}</DropdownItem>
            <DropdownItem>{rejectButton}</DropdownItem>
            <DropdownItem>{disputeButton}</DropdownItem>
          </Dropdown>
        )}
      </div>
    </AdminContent>
  ) : extended && nextInvoice ? (
    <AdminContent>
      <Link to={nextInvoice.censorshiprecord.token}>
        Go to next invoice: {presentationalInvoiceName(nextInvoice)}
      </Link>
    </AdminContent>
  ) : null;
};

export default InvoiceActions;
