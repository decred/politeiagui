import { createContext, useContext, useCallback } from "react";
import * as act from "src/actions";
import { useAction } from "src/redux";
import {
  INVOICE_STATUS_REJECTED,
  INVOICE_STATUS_APPROVED,
  INVOICE_STATUS_DISPUTED
} from "src/containers/Invoice/constants";

export const adminInvoicesActionsContext = createContext();
export const useAdminInvoiceActions = () =>
  useContext(adminInvoicesActionsContext);

export const useAdminActions = () => {
  const onSetInvoiceStatus = useAction(act.onSetInvoiceStatus);
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
    onDisputeInvoice
  };
};
