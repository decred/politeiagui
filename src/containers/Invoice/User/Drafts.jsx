import React, { useState, useCallback } from "react";
import { Text } from "pi-ui";
import { useDraftInvoices } from "./hooks";
import DraftInvoice from "src/componentsv2/Invoice/DraftInvoice";
import useBooleanState from "src/hooks/utils/useBooleanState";
import ModalConfirm from "src/componentsv2/ModalConfirm";
import HelpMessage from "src/componentsv2/HelpMessage";

const Drafts = () => {
  const { draftInvoices, onDeleteDraftInvoice } = useDraftInvoices();
  const [targetDraftID, setTargetDraftID] = useState("");
  const [
    showDeleteDraftModal,
    openDeleteModal,
    closeDeleteModal
  ] = useBooleanState(false);

  const handleOpenDeleteDraftModal = useCallback(
    draftID => {
      setTargetDraftID(draftID);
      openDeleteModal();
    },
    [setTargetDraftID, openDeleteModal]
  );

  const handleDeleteDraft = useCallback(() => {
    onDeleteDraftInvoice(targetDraftID);
    setTargetDraftID("");
  }, [onDeleteDraftInvoice, setTargetDraftID, targetDraftID]);

  const drafts = draftInvoices
    ? Object
        .values(draftInvoices)
        .filter(draft => !!draft.draftId)
        .sort((a, b) => b.timestamp - a.timestamp)
    : [];

  return (
    <>
      {drafts.length ? (
        drafts.map(draft => (
          <DraftInvoice
            key={`draft-${draft.draftId}`}
            onDelete={handleOpenDeleteDraftModal}
            draft={draft}
          />
        ))
      ) : (
        <HelpMessage>No drafts available</HelpMessage>
      )}
      <ModalConfirm
        title={"Delete draft invoice"}
        message="Are you sure you want to delete this draft?"
        successTitle="Draft invoice deleted"
        successMessage={
          <Text>The draft invoice has been successfully deleted!</Text>
        }
        show={showDeleteDraftModal}
        onClose={closeDeleteModal}
        onSubmit={handleDeleteDraft}
      />
    </>
  );
};

export default Drafts;
