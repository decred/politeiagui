import React from "react";
import { useAdminActions, adminInvoicesActionsContext } from "./hooks";
import { Text } from "pi-ui";
import ModalConfirmWithReason from "src/components/ModalConfirmWithReason";
import ModalConfirm from "src/components/ModalConfirm";
import { presentationalInvoiceName } from "src/containers/Invoice/helpers";
import useModalContext from "src/hooks/utils/useModalContext";

const AdminActionsProvider = ({ children }) => {
  const {
    onRejectInvoice,
    onApproveInvoice,
    onDisputeInvoice,
    onPayApprovedInvoices,
    nextInvoice
  } = useAdminActions();

  const [handleOpenModal, handleCloseModal] = useModalContext();

  const hanleOpenRejectModal = (invoice) => {
    handleOpenModal(ModalConfirmWithReason, {
      title: `Reject ${presentationalInvoiceName(invoice)}`,
      reasonLabel: "Reject reason",
      subject: "rejectInvoice",
      onSubmit: onRejectInvoice(invoice),
      successTitle: "Invoice censored",
      successMessage: <Text>The invoice has been successfully rejected!</Text>,
      onClose: handleCloseModal
    });
  };

  const hanleOpenApproveModal = (invoice) => {
    handleOpenModal(ModalConfirm, {
      title: `Approve ${presentationalInvoiceName(invoice)}`,
      message: "Are you sure you want to approve this invoice?",
      onSubmit: onApproveInvoice(invoice),
      successTitle: "Invoice approved",
      successMessage: <Text>The invoice has been successfully approved!</Text>,
      onClose: handleCloseModal
    });
  };

  const hanleOpenDisputeModal = (invoice) => {
    handleOpenModal(ModalConfirm, {
      title: `Dispute ${presentationalInvoiceName(invoice)}`,
      message: "Are you sure you want to dispute this invoice?",
      onSubmit: onDisputeInvoice(invoice),
      successTitle: "Invoice on dispute",
      successMessage: <Text>The invoice has been successfully disputed!</Text>,
      onClose: handleCloseModal
    });
  };

  const hanleOpenPayModal = () => {
    handleOpenModal(ModalConfirm, {
      title: "Pay approved invoices",
      message:
        "Are you sure you want to set all of these approved invoices to paid?",
      onSubmit: onPayApprovedInvoices,
      successTitle: "Inovices paid",
      successMessage: <Text>The invoices have been successfully updated!</Text>,
      onClose: handleCloseModal
    });
  };

  return (
    <adminInvoicesActionsContext.Provider
      value={{
        onReject: hanleOpenRejectModal,
        onApprove: hanleOpenApproveModal,
        onDispute: hanleOpenDisputeModal,
        onPay: hanleOpenPayModal,
        nextInvoice
      }}
    >
      {children}
    </adminInvoicesActionsContext.Provider>
  );
};

export default AdminActionsProvider;
