import React, { useState } from "react";
import { useAdminActions, adminInvoicesActionsContext } from "./hooks";
import { Text } from "pi-ui";
import ModalConfirmWithReason from "src/componentsv2/ModalConfirmWithReason";
import ModalConfirm from "src/componentsv2/ModalConfirm";
import useBooleanState from "src/hooks/utils/useBooleanState";
import { presentationalInvoiceName } from "src/containers/Invoice/helpers";

const AdminActionsProvider = ({ children }) => {
  const [targetInvoice, setTargetInvoice] = useState("");
  const {
    onRejectInvoice,
    onApproveInvoice,
    onDisputeInvoice,
    onPayApprovedInvoices
  } = useAdminActions();
  const [
    showRejectModal,
    openRejectModal,
    closeRejectrModal
  ] = useBooleanState(false);
  const [
    showApproveModal,
    openApproveModal,
    closeApproveModal
  ] = useBooleanState(false);
  const [
    showDisputeModal,
    openDisputeModal,
    closeDisputeModal
  ] = useBooleanState(false);
  const [
    showPayModal,
    openPayModal,
    closePayModal
  ] = useBooleanState(false);

  // set the invoice target before executing the function
  const withInvoiceTarget = (fn) => (invoice) => {
    setTargetInvoice(invoice);
    fn();
  };

  return (
    <adminInvoicesActionsContext.Provider
      value={{
        onReject: withInvoiceTarget(openRejectModal),
        onApprove: withInvoiceTarget(openApproveModal),
        onDispute: withInvoiceTarget(openDisputeModal),
        onPay: openPayModal
      }}>
      <>
        {children}
        <ModalConfirmWithReason
          title={`Reject ${presentationalInvoiceName(targetInvoice)}`}
          reasonLabel="Reject reason"
          subject="rejectInvoice"
          onSubmit={onRejectInvoice(targetInvoice)}
          successTitle="Invoice censored"
          successMessage={
            <Text>The invoice has been successfully rejected!</Text>
          }
          show={showRejectModal}
          onClose={closeRejectrModal}
        />
        <ModalConfirm
          title={`Approve ${presentationalInvoiceName(targetInvoice)}`}
          message="Are you sure you want to approve this invoice?"
          onSubmit={onApproveInvoice(targetInvoice)}
          successTitle="Invoice approved"
          successMessage={
            <Text>The invoice has been successfully approved!</Text>
          }
          show={showApproveModal}
          onClose={closeApproveModal}
        />
        <ModalConfirm
          title={`Dispute ${presentationalInvoiceName(targetInvoice)}`}
          message="Are you sure you want to dispute this invoice?"
          onSubmit={onDisputeInvoice(targetInvoice)}
          successTitle="Invoice on dispute"
          successMessage={
            <Text>The invoice has been successfully disputed!</Text>
          }
          show={showDisputeModal}
          onClose={closeDisputeModal}
        />
        <ModalConfirm
          title="Pay approved invoices"
          message="Are you sure you want to set all of these approved invoices to paid?"
          onSubmit={onPayApprovedInvoices}
          successTitle="Inovices paid"
          successMessage={
            <Text>The invoices have been successfully updated!</Text>
          }
          show={showPayModal}
          onClose={closePayModal}
        />
      </>
    </adminInvoicesActionsContext.Provider>
  );
};

export default AdminActionsProvider;
