import React, { useCallback } from "react";
import {
  Button,
  classNames,
  useMediaQuery,
  Dropdown,
  DropdownItem
} from "pi-ui";
import { useAdminInvoiceActions } from "./hooks";
import AdminContent from "src/componentsv2/AdminContent";
import { isUnreviewedInvoice } from "../helpers";

const InvoiceActions = ({ invoice }) => {
  if (!useAdminInvoiceActions()) {
    throw Error(
      "Admin invoices actions requires an 'AdminActionsProvider' on a higher level of the component tree. "
    );
  }
  const mobile = useMediaQuery("(max-width: 560px)");
  const { onApprove, onReject, onDispute } = useAdminInvoiceActions();

  const withInvoice = useCallback(
    fn => () => {
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
      kind="secondary"
    >
      Reject
    </Button>
  );
  const disputeButton = (
    <Button
      onClick={withInvoice(onDispute)}
      className={classNames("margin-right-s")}
      noBorder
      kind="secondary"
    >
      Dispute
    </Button>
  );

  return (
    isUnreviewedInvoice(invoice) && (
      <AdminContent>
        <div className="justify-right margin-top-m">
          {!mobile ? (
            <>
              {rejectButton}
              {disputeButton}
              {approveButton}
            </>
          ) : (
            <Dropdown title="Actions">
              <DropdownItem>{approveButton}</DropdownItem>
              <DropdownItem>{rejectButton}</DropdownItem>
              <DropdownItem>{disputeButton}</DropdownItem>
            </Dropdown>
          )}
        </div>
      </AdminContent>
    )
  );
};

export default InvoiceActions;
