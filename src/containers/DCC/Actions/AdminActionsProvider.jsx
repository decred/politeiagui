import React from "react";
import { useAdminActions, adminDccsActionsContext } from "./hooks";
import { Text } from "pi-ui";
import ModalConfirmWithReason from "src/components/ModalConfirmWithReason";
import useBooleanState from "src/hooks/utils/useBooleanState";
import useAsyncState from "src/hooks/utils/useAsyncState";
import { presentationalDccName } from "src/containers/DCC/helpers";

const AdminActionsProvider = ({ children }) => {
  const [targetDcc, setTargetDcc] = useAsyncState("");
  const {
    onRejectDcc,
    onApproveDcc
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

  // set the dcc target before executing the function
  const withDccTarget = (fn) => async (dcc) => {
    await setTargetDcc(dcc);
    fn();
  };

  return (
    <adminDccsActionsContext.Provider
      value={{
        onReject: withDccTarget(openRejectModal),
        onApprove: withDccTarget(openApproveModal)
      }}
    >
      {children}
      <ModalConfirmWithReason
        title={`Reject ${presentationalDccName(targetDcc)}`}
        reasonLabel="Reject reason"
        subject="rejectDcc"
        onSubmit={onRejectDcc(targetDcc)}
        successTitle="DCC rejected"
        successMessage={
          <Text>The dcc has been successfully rejected!</Text>
        }
        show={showRejectModal}
        onClose={closeRejectrModal}
      />
      <ModalConfirmWithReason
        title={`Approve ${presentationalDccName(targetDcc)}`}
        reasonLabel="Approve reason"
        subject="approveDcc"
        onSubmit={onApproveDcc(targetDcc)}
        successTitle="DCC approved"
        successMessage={
          <Text>The dcc has been successfully approved!</Text>
        }
        show={showApproveModal}
        onClose={closeApproveModal}
      />
    </adminDccsActionsContext.Provider>
  );
};

export default AdminActionsProvider;
