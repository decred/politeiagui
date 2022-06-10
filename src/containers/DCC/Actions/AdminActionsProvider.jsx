import React from "react";
import { useAdminActions, adminDccsActionsContext } from "./hooks";
import { Text } from "pi-ui";
import ModalConfirmWithReason from "src/components/ModalConfirmWithReason";
import { presentationalDccName } from "src/containers/DCC/helpers";
import useModalContext from "src/hooks/utils/useModalContext";

const AdminActionsProvider = ({ children }) => {
  const { onRejectDcc, onApproveDcc } = useAdminActions();

  const [handleOpenModal, handleCloseModal] = useModalContext();

  const handleOpenRejectModal = (dcc) => {
    handleOpenModal(ModalConfirmWithReason, {
      title: `Reject ${presentationalDccName(dcc)}`,
      reasonLabel: "Reject reason",
      subject: "rejectDcc",
      onSubmit: onRejectDcc(dcc),
      successTitle: "DCC rejected",
      successMessage: <Text>The dcc has been successfully rejected!</Text>,
      onClose: handleCloseModal
    });
  };

  const handleOpenApproveModal = (dcc) => {
    handleOpenModal(ModalConfirmWithReason, {
      title: `Approve ${presentationalDccName(dcc)}`,
      reasonLabe: "Approve reason",
      subject: "approveDcc",
      onSubmit: onApproveDcc(dcc),
      successTitle: "DCC approved",
      successMessage: <Text>The dcc has been successfully approved!</Text>,
      onClose: handleCloseModal
    });
  };

  return (
    <adminDccsActionsContext.Provider
      value={{
        onReject: handleOpenRejectModal,
        onApprove: handleOpenApproveModal
      }}
    >
      {children}
    </adminDccsActionsContext.Provider>
  );
};

export default AdminActionsProvider;
