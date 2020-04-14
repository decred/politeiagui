import React from "react";
import { Text } from "pi-ui";
import { useDraftInvoices } from "./hooks";
import DraftInvoice from "src/components/Invoice/DraftInvoice";
import ModalConfirm from "src/components/ModalConfirm";
import HelpMessage from "src/components/HelpMessage";
import useModalContext from "src/hooks/utils/useModalContext";

const Drafts = () => {
  const { draftInvoices, onDeleteDraftInvoice } = useDraftInvoices();

  const [handleOpenModal, handleCloseModal] = useModalContext();

  const handleOpenDeleteDraftModal = (draftId) => () => {
    handleOpenModal(ModalConfirm, {
      title: "Delete draft invoice",
      message: "Are you sure you want to delete this draft?",
      successTitle: "Draft invoice deleted",
      successMessage: (
        <Text>The draft invoice has been successfully deleted!</Text>
      ),
      onClose: handleCloseModal,
      onSubmit: handleDeleteDraft(draftId)
    });
  };

  const handleDeleteDraft = (draftId) => () => {
    onDeleteDraftInvoice(draftId);
  };

  const drafts = draftInvoices
    ? Object.values(draftInvoices)
        .filter((draft) => !!draft.draftId)
        .sort((a, b) => b.timestamp - a.timestamp)
    : [];

  return (
    <div className="margin-top-m">
      {drafts.length ? (
        drafts.map((draft) => (
          <DraftInvoice
            key={`draft-${draft.draftId}`}
            onDelete={handleOpenDeleteDraftModal(draft.draftId)}
            draft={draft}
          />
        ))
      ) : (
        <HelpMessage>No drafts available</HelpMessage>
      )}
    </div>
  );
};

export default Drafts;
