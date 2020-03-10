import { createContext, useContext, useCallback, useMemo } from "react";
import * as act from "src/actions";
import * as sel from "src/selectors";
import { useAction, useSelector } from "src/redux";
import {
  INVOICE_STATUS_REJECTED,
  INVOICE_STATUS_APPROVED,
  INVOICE_STATUS_DISPUTED,
  INVOICE_STATUS_NEW,
  INVOICE_STATUS_UPDATED
} from "src/containers/Invoice/constants";
import { or } from "src/lib/fp";
import isEqual from "lodash/fp/isEqual";

export const adminInvoicesActionsContext = createContext();
export const useAdminInvoiceActions = () =>
  useContext(adminInvoicesActionsContext);

export const useAdminActions = () => {
  const onSetInvoiceStatus = useAction(act.onSetInvoiceStatus);
  const onPayApprovedInvoices = useAction(act.onPayApprovedInvoices);
  const invoices = useSelector(sel.allInvoices);
  const nextInvoice = useMemo(
    () =>
      invoices &&
      invoices.find((invoice) =>
        or(
          isEqual(INVOICE_STATUS_NEW),
          isEqual(INVOICE_STATUS_UPDATED)
        )(invoice.status)
      ),
    [invoices]
  );

  const onRejectInvoice = useCallback(
    (invoice) => (reason) =>
      onSetInvoiceStatus(
        invoice.censorshiprecord.token,
        INVOICE_STATUS_REJECTED,
        invoice.version,
        reason
      ),
    [onSetInvoiceStatus]
  );

  const onApproveInvoice = useCallback(
    (invoice) => () =>
      onSetInvoiceStatus(
        invoice.censorshiprecord.token,
        INVOICE_STATUS_APPROVED,
        invoice.version
      ),
    [onSetInvoiceStatus]
  );

  const onDisputeInvoice = useCallback(
    (invoice) => () =>
      onSetInvoiceStatus(
        invoice.censorshiprecord.token,
        INVOICE_STATUS_DISPUTED,
        invoice.version
      ),
    [onSetInvoiceStatus]
  );

  return {
    onRejectInvoice,
    onApproveInvoice,
    onDisputeInvoice,
    onPayApprovedInvoices,
    nextInvoice
  };
};
