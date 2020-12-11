import React, { useCallback } from "react";
import { Spinner } from "pi-ui";
import { AdminInvoiceActionsProvider } from "src/containers/Invoice/Actions";
import Invoice from "src/components/Invoice";
import useAdminInvoices from "src/hooks/api/useAdminInvoices";
import HelpMessage from "src/components/HelpMessage";
import styles from "./ListWrapper.module.css";

const InvoicesAdmin = ({ userID }) => {
  const { loading, invoices } = useAdminInvoices();
  const userInovices = invoices.filter((inv) => inv.userid === userID);
  const renderInvoice = useCallback(
    (invoice) => (
      <Invoice
        key={`invoice-${invoice.censorshiprecord.token}`}
        invoice={invoice}
      />
    ),
    []
  );
  const renderInvoices = useCallback(
    (invoices) => invoices.map(renderInvoice),
    [renderInvoice]
  );
  const renderEmptyMessage = useCallback(
    (invoices) =>
      !invoices.length && (
        // XXX: improve this message
        <HelpMessage>
          {"There are no invoices submitted by this user."}
        </HelpMessage>
      ),
    []
  );
  return (
    <AdminInvoiceActionsProvider>
      {loading && (
        <div className={styles.spinnerWrapper}>
          <Spinner invert />
        </div>
      )}
      {!loading && (
        <>
          {renderEmptyMessage(userInovices)}
          {renderInvoices(userInovices)}
        </>
      )}
    </AdminInvoiceActionsProvider>
  );
};

export default InvoicesAdmin;
